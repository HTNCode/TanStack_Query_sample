# Axios Data URI Vulnerability Fix

## 概要 (Overview)

このプロジェクトでは、AxiosライブラリのData URI脆弱性を修正しました。この脆弱性は、攻撃者が巨大なdata: URIを送信することで、サーバーのメモリを無制限に消費させ、DoS攻撃を可能にするものでした。

## 脆弱性の詳細 (Vulnerability Details)

### 問題
- Axiosがdata: URIを処理する際、`maxContentLength`と`maxBodyLength`の制限が無視される
- Base64データが全てメモリに展開されるため、大きなdata: URIによりメモリ不足でプロセスがクラッシュ
- 攻撃者が悪意のある大きなdata: URIを送信することでDoS攻撃が可能

### 影響範囲
- Node.js環境でAxiosを使用している全てのアプリケーション
- data: URIを許可している全てのエンドポイント

## 修正内容 (Fix Implementation)

### 1. セキュアなAxiosインスタンスの作成
`src/utils/secureAxios.ts`にて以下を実装：

- **Data URI サイズ検証**: リクエスト前にdata: URIのサイズを事前計算
- **インターセプター**: 全てのリクエストでdata: URIを自動検証
- **デフォルト制限**: maxContentLength/maxBodyLengthを1MBに設定

### 2. 既存コードの更新
- `Posts.tsx`: 安全なAxiosインスタンスを使用
- `Post.tsx`: 安全なAxiosインスタンスを使用
- セキュリティテストコンポーネントを追加

### 3. 検証機能
- リアルタイムでの脆弱性テスト
- 修正前後の動作比較
- 正常なHTTPリクエストの動作確認

## 使用方法 (Usage)

### セキュアなAxiosの使用
```typescript
import { secureGet } from './utils/secureAxios';

// 安全なGETリクエスト
const response = await secureGet('https://api.example.com/data', {
  maxContentLength: 1024 * 1024, // 1MB制限
});
```

### 手動でのData URI検証
```typescript
import { validateDataURI } from './utils/secureAxios';

// Data URIの事前検証
validateDataURI(url, maxSize);
```

## テスト結果 (Test Results)

セキュリティテストコンポーネントを実行することで以下を確認できます：

1. ✅ **大きなData URIのブロック**: 1MB以上のdata: URIが適切に拒否される
2. ✅ **小さなData URIの処理**: 正常なdata: URIが適切に処理される  
3. ✅ **HTTPリクエストの継続**: 通常のHTTPリクエストは影響を受けない
4. ❌ **脆弱性の確認**: 修正前のaxiosでは大きなdata: URIが処理されてしまう

## セキュリティ推奨事項 (Security Recommendations)

1. **常にセキュアなAxiosインスタンスを使用**
2. **適切なコンテンツサイズ制限の設定**
3. **定期的なセキュリティテストの実施**
4. **依存関係の定期的な更新**

## 技術的詳細 (Technical Details)

### Base64サイズ計算
```typescript
// Base64: 4文字で3バイトを表現
const estimatedSize = Math.floor((base64String.length * 3) / 4);
```

### インターセプター実装
```typescript
secureAxios.interceptors.request.use((config) => {
  if (config.url) {
    validateDataURI(config.url, config.maxContentLength || MAX_CONTENT_LENGTH);
  }
  return config;
});
```

## 参考資料 (References)

- [CVE Details: Axios Data URI Vulnerability](https://github.com/axios/axios/security/advisories)
- [Security Best Practices for Node.js](https://nodejs.org/en/security/)