# makeHoverItems

このプロジェクトは deno を使っています。

deno でネットワーク、ファイルシステムへアクセスするには明示的な許可が必要です。

実行するときは必要に応じて以下のフラグを追加しながらコマンドを叩いてください。

- ファイル読み込み　--allow-read
- ファイル書き込み　--allow-write
- ネットワークアクセス　--allow-net

```sh
$ deno run [flags] script.ts

# ネットだけ許可
$ deno run --allow-net script.ts
```

# ディレクトリ説明

`./data` jsonファイルを出力する場所

`./libs` classファイルとかを置いとく場所

`./test` 製作物のテストファイルをおく場所
