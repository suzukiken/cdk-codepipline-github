import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

export class CdkcodepiplineGithubStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX = id.toLowerCase().replace('stack', '')

    const bucket = new s3.Bucket(this, 'bucket', {
      bucketName: PREFIX + '-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const pipeline_project = new codebuild.PipelineProject(this, 'pipeline_project', {
      projectName: PREFIX + '-pipelineproject',
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml') // this line is not necessary. 
    })
    
    const source_output = new codepipeline.Artifact();
    const build_output = new codepipeline.Artifact();

    const source_action = new codepipeline_actions.GitHubSourceAction({
      actionName: PREFIX + '-sourceaction',
      owner: 'suzukiken',
      repo: 'codepipeline',
      oauthToken: cdk.SecretValue.secretsManager('gitHub-access-token'),
      output: source_output,
      branch: 'main'
    })

    const build_action = new codepipeline_actions.CodeBuildAction({
      actionName: PREFIX + '-buildaction',
      project: pipeline_project,
      input: source_output,
      outputs: [build_output],
      executeBatchBuild: false
    })
    
    const deploy_action = new codepipeline_actions.S3DeployAction({
      actionName: PREFIX + '-deployaction',
      input: build_output,
      bucket: bucket,
    })

    const pipeline = new codepipeline.Pipeline(this, 'pipeline', {
      pipelineName: PREFIX + '-pipeline',
      stages: [
        {
          stageName: 'source',
          actions: [source_action],
        },
        {
          stageName: 'build',
          actions: [build_action],
        },
        {
          stageName: 'deploy',
          actions: [deploy_action],
        }
      ],
    })
    
  }
}
