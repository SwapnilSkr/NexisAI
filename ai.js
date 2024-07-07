import Together from "together-ai";
import dotenv from "dotenv";
import { User } from "./model.js";
dotenv.config();

const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"], // This is the default and can be omitted
});

export const aiResponse = async (content, userId) => {
  console.log(content);
  let lineUser = await User.findOne({ userId });

  if (!lineUser) {
    lineUser = new User({
      userId,
      messages: [
        {
          role: "user",
          content:
            "あなたは日本の製造業向けAIアシスタントであるNexiKojoです。あなたの役割は、AIを活用して製造業の運営効率を向上させることです。すべての質問に対して日本語で応答し、他の言語で書かれていても常に日本語の文字（カタカナや漢字）で回答してください。\n" +
            "あなたの目的は、以下のような製造業の課題に対応することです:\n" +
            "1. 需要予測: 歴史的データ、市場動向、外部要因を分析し、正確な需要予測を生成します。\n" +
            "2. 予知保全: IoTセンサーからのリアルタイムデータを使用して、異常を検出し、潜在的な故障を予測します。\n" +
            "3. 自動品質管理: 生産ラインの高解像度カメラとセンサーを統合し、リアルタイムで製品を検査します。\n" +
            "4. エネルギー最適化: 様々なエネルギー消費システムとプロセスからデータを収集し、消費パターンを分析します。\n" +
            "5. 労働力管理: 歴史的な労働力データ、生産スケジュール、スキル要件を分析し、シフト計画を最適化します。\n" +
            "6. システム統合とデータ処理: 既存のERP、MES、SCADAシステムとシームレスに統合します。\n" +
            "7. 日本の製造業に特化: 日本の製造原則をAIモデルに組み込み、言語サポートを提供します。\n" +
            "8. 継続的な学習と改善: フェデレーテッドラーニング技術を利用して、データプライバシーを保護しながらモデルを改善します。\n" +
            "会社情報: Career Survival Inc.は2022年10月20日に名古屋市、愛知県で設立され、代表取締役の松岡大介が率いています。チームメンバーには、企業研修やコンサルティングの経験が豊富な代表取締役の松岡大介、生産技術エンジニアとしてDXと業務改善に取り組む取締役の久米内元樹、システム開発とUI/UXデザインを担当するDX事業マネージャーの松本健吾、そしてインド支社のオフショア開発チームを率いる支社長のカシシュ・クマールが含まれます。\n" +
            content,
        },
      ],
    });
  } else {
    lineUser.messages.push({
      role: "user",
      content,
    });
  }

  const messages = lineUser.messages;

  const response = await together.chat.completions.create({
    messages,
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  });

  lineUser.messages.push({
    role: "assistant",
    content: response?.choices?.[0].message?.content,
  });

  await lineUser.save();
  console.log(response);
  return response;
};
