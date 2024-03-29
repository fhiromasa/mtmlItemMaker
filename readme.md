# makeHoverItems

このプロジェクトは deno を使っています。

deno でネットワーク、ファイルシステムへアクセスするには明示的な許可が必要です。

実行するときは必要に応じて以下のフラグを追加しながらコマンドを叩いてください。

- ファイル読み込み　--allow-read
- ファイル書き込み　--allow-write
- ネットワークアクセス　--allow-net

```sh
$ deno run [flags] mod.ts

# ネットだけ許可
$ deno run --allow-net mod.ts

# ネット,書き込み,読み込み許可
$ deno run --allow-net --allow-write --allow-read mod.ts
```

# ディレクトリ説明

`./libs` classファイルとかを置いとく場所

`./test` 製作物のテストファイルをおく場所

# ブランチ説明

masterブランチはソースコードを置いておくだけ。実行結果のjsonファイルは絶対にコミットしたくない。

| name    | new branch | merge into |
| :------ | :--------- | :--------- |
| master  | -          | release    |
| feature | master     | master     |
| release | master     | -          |
