import { access, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

const workflowPath = '.github/workflows/ci.yml';

type WorkflowJob = {
  if?: string;
  name?: string;
  needs?: string | string[];
  permissions?: Record<string, string>;
  steps?: Array<{
    uses?: string;
    with?: Record<string, string>;
  }>;
};

type Workflow = {
  on: Record<string, unknown>;
  permissions: Record<string, string>;
  concurrency: {
    group: string;
    'cancel-in-progress': boolean;
  };
  jobs: Record<string, WorkflowJob>;
};

async function loadWorkflow(): Promise<Workflow> {
  return parse(await readFile(workflowPath, 'utf8')) as Workflow;
}

describe('Pages deployment workflow', () => {
  it('runs the same blocking gates for automatic and manual deployments', async () => {
    const workflow = await loadWorkflow();
    const pagesBuild = workflow.jobs['pages-build'];

    expect(workflow.on).toHaveProperty('workflow_dispatch');
    expect(pagesBuild.needs).toEqual(['check', 'duplication', 'analysis', 'security']);
    expect(pagesBuild.if).toBe("github.event_name != 'pull_request'");
  });

  it('cancels superseded runs for the same ref before they can deploy', async () => {
    const workflow = await loadWorkflow();

    expect(workflow.concurrency).toEqual({
      group: 'ci-${{ github.ref }}',
      'cancel-in-progress': true,
    });
  });

  it('builds and deploys the tested workflow SHA in one dependency chain', async () => {
    const workflow = await loadWorkflow();
    const pagesBuild = workflow.jobs['pages-build'];
    const checkout = pagesBuild.steps?.find((step) => step.uses?.startsWith('actions/checkout@'));
    const deploy = workflow.jobs.deploy;

    expect(checkout?.with?.ref).toBe('${{ github.sha }}');
    expect(deploy.needs).toBe('pages-build');
    expect(deploy.name).toContain('${{ github.sha }}');
    expect(deploy.name).toContain('${{ github.run_id }}');
    expect(deploy.steps).toContainEqual(
      expect.objectContaining({ uses: 'actions/deploy-pages@v5' }),
    );
    await expect(access('.github/workflows/deploy.yml')).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('grants Pages and OIDC writes only to deployment', async () => {
    const workflow = await loadWorkflow();

    expect(workflow.permissions).toEqual({ contents: 'read' });
    expect(workflow.jobs.deploy.permissions).toEqual({
      pages: 'write',
      'id-token': 'write',
    });

    for (const [jobId, job] of Object.entries(workflow.jobs)) {
      if (jobId !== 'deploy') {
        expect(job.permissions?.pages).toBeUndefined();
        expect(job.permissions?.['id-token']).toBeUndefined();
      }
    }
  });
});
