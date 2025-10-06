# 音読日和

毎日の朗読習慣を支援するWebアプリケーション

## 概要

「音読日和」は、認知機能維持と発声訓練を目的とした朗読習慣形成アプリです。Wikipedia、NHKニュース、気象庁から毎日新しい朗読コンテンツを自動取得し、100〜300字程度の適切な分量で提供します。

## 主な機能（Phase 1）

### データ取得
- Wikipedia「今日は何の日」（日本の出来事を優先表示）
- NHKニュース RSS（主要ニュース5件）
- 気象庁天気概況（関東地方）

### ユーザー機能
- 朗読コンテンツの表示
- フォントサイズ調整（小・中・大・特大）
- ダークモード
- 読書記録管理
- 連続日数カウント

### 技術的特徴
- 3つのAPIを並列取得（Promise.allSettled）
- 一部API失敗時も継続動作
- LocalStorageによるデータ永続化
- レスポンシブデザイン

## 技術スタック

- **フレームワーク**: Next.js 15.5.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ取得**: fetch API
- **XMLパース**: fast-xml-parser
- **デプロイ**: Vercel

## セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/damgoweb/daily-voice-app.git
cd daily-voice-app

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

### ビルド

```bash
# 本番ビルド
npm run build

# 本番モードで起動
npm run start
```

## API エンドポイント

### Wikipedia API
```
GET /api/wikipedia?date=YYYY-MM-DD
```
指定日付の「今日は何の日」を取得（日本の出来事を優先）

### News API
```
GET /api/news
```
NHKニュースRSSから主要ニュース5〜7件を取得

### Government API
```
GET /api/government?type=weather&region=130000
```
気象庁から天気概況を取得（デフォルト: 東京都）

### 統合API
```
GET /api/daily-reading?date=YYYY-MM-DD&sources=wiki,news,gov&force=true
```
3つのAPIを統合して朗読コンテンツを提供

**パラメータ:**
- `date`: 日付（YYYY-MM-DD形式）
- `sources`: 有効なデータソース（wiki,news,gov）
- `force`: 強制更新（true/false）

## プロジェクト構造

```
daily-voice-app/
├── app/
│   ├── api/              # API Route Handlers
│   │   ├── wikipedia/
│   │   ├── news/
│   │   ├── government/
│   │   └── daily-reading/
│   ├── page.tsx          # ホーム画面
│   └── layout.tsx
├── components/           # UIコンポーネント
│   ├── ReadingDisplay.tsx
│   ├── WikipediaSection.tsx
│   ├── NewsSection.tsx
│   ├── GovernmentSection.tsx
│   ├── StatsCards.tsx
│   ├── ActionButtons.tsx
│   └── SettingsPanel.tsx
├── hooks/                # カスタムフック
│   ├── useDailyReading.ts
│   ├── useReadingHistory.ts
│   └── useSettings.ts
├── lib/
│   ├── types.ts          # 型定義
│   ├── utils.ts          # ユーティリティ関数
│   └── db.ts             # IndexedDB（Phase 2で実装予定）
└── public/
```

## データ保存

Phase 1ではLocalStorageを使用：
- ユーザー設定（フォントサイズ、ダークモード）
- 読書履歴
- 連続日数

Phase 2でIndexedDBに移行予定

## 今後の予定（Phase 2）

- カレンダー機能（過去の朗読記録を表示）
- 音声録音機能（朗読の録音と保存）
- IndexedDB統合（データ永続化の強化）
- PWA対応（オフライン動作、プッシュ通知）
- 詳細設定（地域選択、文字数制限）
- フォールバックデータ（API失敗時の代替コンテンツ）

## ライセンス

MIT License

## データソース

- Wikipedia日本語版（CC-BY-SA）
- NHKニュース（RSS）
- 気象庁（気象データ）

## 開発者

damgoweb

## リポジトリ

https://github.com/damgoweb/daily-voice-app

## デプロイ

Vercel: https://daily-voice-app.vercel.app