import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import * as cdk from "aws-cdk-lib";
import * as cf from "aws-cdk-lib/aws-cloudfront";

export default {
  config(_input) {
    return {
      name: "pantry-tracker",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const serverCachePolicy = new cf.CachePolicy(stack, "ServerCache", {
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
        headerBehavior: cf.CacheHeaderBehavior.none(),
        cookieBehavior: cf.CacheCookieBehavior.none(),
        defaultTtl: cdk.Duration.days(0),
        maxTtl: cdk.Duration.days(365),
        minTtl: cdk.Duration.days(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

      const site = new NextjsSite(stack, "site", {
        // customDomain: {
        //   domainName: "webdevcody.com",
        //   domainAlias: "www.ytchaptersgenerator.com",
        // },
        cdk: {
          serverCachePolicy,
          server: {
            logRetention: RetentionDays.ONE_MONTH,
          },
        },
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
