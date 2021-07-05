+++
title = "CodePipelineでGithubのリポジトリをデプロイする"
date = "2021-04-09"
tags = ["CodePipeline", "Github"]
+++

[CodePipelineを作る方のGithubのリポジトリ](https://github.com/suzukiken/cdkcodepipline-github)

[デプロイされる方のGithubのリポジトリ](https://github.com/suzukiken/cdkcodepipeline-github-repo)

GithubからCodePipelineにデータを取り込むのに[Githubのアクセストークン](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)を使っている。

このGithubのアクセストークンを使う方法はAWSのドキュメントでは「GitHub version 1 source action」とされていて推奨されておらず、新しい「GitHub version 2 source action」の方が推奨されている。[参考](https://docs.aws.amazon.com/codepipeline/latest/userguide/update-github-action-connections.html)

version 2については[こちらで使った](/aws/cdkcodepipeline-github-cloudfront)。