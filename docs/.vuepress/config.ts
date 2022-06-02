import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import * as path from "path";

const absolute_path: string = path.resolve(__dirname, '../../', 'src/example');
const docTitle: string = "XueWeb3 Example";

export default defineUserConfig<DefaultThemeOptions>({
  base: "/xueweb3/",
  lang: "en-US",
  title: docTitle,
  themeConfig: {
    navbar: [{ text: "GitHub", link: "https://github.com/kojie2008/xueweb3.git" }],
    locales: {
      "/": {
        selectLanguageName: "English",
        sidebar: [
          {
            text: "Getting Started",
            children: ["/README.md"],
          },
          {
            text: "Tour",
            children: [
              { text: "Create Keypair (Account)", link: "/tour/create-keypair" },
              { text: "Request Airdrop", link: "/tour/request-airdrop" },
              { text: "Get Balance (SOL)", link: "/tour/get-sol-balance" },
              { text: "Transfer (SOL)", link: "/tour/transfer" },
              { text: "Create Mint (Token)", link: "/tour/create-mint" },
              { text: "Get Mint (Token)", link: "/tour/get-mint" },
              { text: "Create Account (Token)", link: "/tour/create-token-account" },
              { text: "Get Account (Token)", link: "/tour/get-token-account" },
              { text: "Mint To (Token)", link: "/tour/mint-to" },
              { text: "Get Balance (Token)", link: "/tour/get-token-balance" },
              { text: "Transfer (Token)", link: "/tour/token-transfer" },
            ],
          },
          {
            text: "Advanced",
            children: [
              {
                text: "Token",
                children: [
                  {
                    text: "Wrapped SOL",
                    children: [
                      { text: "Create Token Account", link: "/advanced/token/wrapped-sol/create-token-account" },
                      { text: "Add Balanace", link: "/advanced/token/wrapped-sol/add-balance" },
                    ],
                  },
                  { text: "Close Account", link: "/advanced/token/close-account" },
                  { text: "Set Authority", link: "/advanced/token/set-authority" },
                  { text: "Get All Token Account By Owner", link: "/advanced/token/get-all-token-account-by-owner" },
                ],
              },
              {
                text: "Metaplex (NFT)",
                children: [
                  { text: "Get Token Metadata", link: "/advanced/metaplex/get-tokenmeta" },
                  { text: "Get NFT", link: "/advanced/metaplex/get-nft" },
                  { text: "Mint NFT", link: "/advanced/metaplex/mint-nft" },
                ],
              },
              {
                text: "Durable Nonce",
                link: "/advanced/durable-nonce/README.md",
                children: [
                  { text: "Create Nonce Account", link: "/advanced/durable-nonce/create-nonce-account" },
                  { text: "Get Nonce Account", link: "/advanced/durable-nonce/query-nonce" },
                  { text: "Use Nonce", link: "/advanced/durable-nonce/use-nonce" },
                ],
              },
            ],
          },
        ],
      },
      "/zh/": {
        selectLanguageName: "中文",
        sidebar: [
          {
            text: "开始",
            children: ["/zh/README.md"],
          },
          {
            text: "入门",
            children: [
              { text: "创建钱包", link: "/zh/tour/create-keypair" },
              { text: "空投测试币", link: "/zh/tour/request-airdrop" },
              { text: "获取SOL余额", link: "/zh/tour/get-sol-balance" },
              { text: "SOL转账", link: "/zh/tour/transfer" },
              { text: "创建代币", link: "/zh/tour/create-mint" },
              { text: "获取代币信息", link: "/zh/tour/get-mint" },
              { text: "创建代币账户", link: "/zh/tour/create-token-account" },
              { text: "获取代币账户信息", link: "/zh/tour/get-token-account" },
              { text: "增发代币", link: "/zh/tour/mint-to" },
              { text: "获取代币余额", link: "/zh/tour/get-token-balance" },
              { text: "代币转账", link: "/zh/tour/token-transfer" },
            ],
          },
          {
            text: "进阶",
            children: [
              {
                text: "代币",
                children: [
                  {
                    text: "包装SOL",
                    children: [
                      { text: "创建账户", link: "/zh/advanced/token/wrapped-sol/create-token-account" },
                      { text: "增加持有量", link: "/zh/advanced/token/wrapped-sol/add-balance" },
                    ],
                  },
                  { text: "关闭账户", link: "/zh/advanced/token/close-account" },
                  { text: "设定权限", link: "/zh/advanced/token/set-authority" },
                  { text: "根据Owner获取代币账户", link: "/zh/advanced/token/get-all-token-account-by-owner" },
                ],
              },
              {
                text: "数字藏品(NFT)",
                children: [
                  { text: "代币元数据", link: "/zh/advanced/metaplex/get-tokenmeta" },
                  { text: "获取NFT", link: "/advanced/metaplex/get-nft" },
                  { text: "铸币NFT", link: "/advanced/metaplex/mint-nft" },
                ],
              },
              {
                text: "持久Nonce",
                link: "/zh/advanced/durable-nonce/README.md",
                children: [
                  { text: "创建Nonce账户", link: "/zh/advanced/durable-nonce/create-nonce-account" },
                  { text: "获取Nonce", link: "/zh/advanced/durable-nonce/query-nonce" },
                  { text: "使用Nonce", link: "/zh/advanced/durable-nonce/use-nonce" },
                ],
              },
            ],
          },
        ],
      },
    },
  },

  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    "/": {
      lang: "en-US",
      title: docTitle,
    },
    "/zh/": {
      lang: "zh-CN",
      title: docTitle,
    },
  },

  markdown: {
    importCode: {
      handleImportPath: (str) => str.replace(/^@/, absolute_path),
    },
  },

  plugins: [
    [
      "@vuepress/plugin-google-analytics",
      {
        id: "G-QBVBH32M0L",
      },
    ],
  ],
});
