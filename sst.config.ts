import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import * as cdk from "aws-cdk-lib";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import { Queue } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "youtube-chapters",
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

      const queueTimeout = 180;

      const deadLetterQueue = new Queue(stack, "DeadLetterQueue");

      const queue = new Queue(stack, "Queue", {
        cdk: {
          queue: {
            visibilityTimeout: cdk.Duration.seconds(queueTimeout + 10),
          },
        },
        consumer: {
          function: {
            handler: "src/async/chapter-generator.main",
            timeout: queueTimeout,
            environment: {
              DATABASE_URL: process.env.DATABASE_URL!,
              OPENAI_KEY: process.env.OPENAI_KEY!,
              NODE_ENV: process.env.NODE_ENV!,
              JOB_VERSION: "version_0",
            },
            deadLetterQueue: deadLetterQueue.cdk.queue,
            retryAttempts: 0,
          },
          cdk: {
            eventSource: {
              batchSize: 1,
            },
          },
        },
      });

      const site = new NextjsSite(stack, "site", {
        bind: [queue],
        customDomain: {
          domainName: "ytchaptersgenerator.com",
          domainAlias: "www.ytchaptersgenerator.com",
        },
        cdk: {
          serverCachePolicy,
          server: {
            logRetention: RetentionDays.ONE_MONTH,
          },
        },
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
          OPENAI_KEY: process.env.OPENAI_KEY!,
          NODE_ENV: process.env.NODE_ENV!,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
          STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          HOST_NAME: process.env.HOST_NAME!,
          PRICE_ID_50: process.env.PRICE_ID_50!,
          PRICE_ID_100: process.env.PRICE_ID_100!,
          PRICE_ID_250: process.env.PRICE_ID_250!,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
          QUEUE_URL: queue.queueUrl,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
