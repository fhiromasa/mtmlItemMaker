import * as utils from "../libs/utils.ts";
import { GlobalModifier, LocalModifier, Tag } from "../libs/item.ts";

export const movabletype_net_testData = {
  expected_tag1: new Tag(
    "MTAsset",
    "undefined",
    "id モディファイアで指定した単一のアイテムを表示する為のブロックタグです。",
    "https://movabletype.net/tags/2007/08/asset.html",
    {
      id: new LocalModifier(
        "id",
        "表示させたいアイテムの id を指定します。",
        "ID",
      ),
    },
  ),
  expected_tag2: new Tag(
    "MTWebsitePath",
    "undefined",
    "ウェブサイトのメインページ (index.html) が置かれるパス名を表示します。ウェブブラウザで表示する URL ではなく、ファイルが実際に保管されるパスを表示します。",
    "https://movabletype.net/tags/2009/11/websitepath.html",
    {},
  ),
  expected_modifier1: new GlobalModifier(
    "count_characters",
    "1 を設定すると、MT タグの値に含まれる文字数 (空白を含む) を表示します。",
    "https://movabletype.net/tags/2007/08/count_characters.html",
  ),
};

export const movabletype_testData = {
  invalidUrlItem: new Tag(
    "MTInvalidURLItem",
    "undefined",
    utils.dummyTag.description,
    "invalid url",
    {},
  ),

  expected_tag1: new Tag(
    "MTActions",
    "block",
    [
      "ユーザーの投稿した記事やトピック、コメント、お気に入り登録など、コミュニティ内でのアクション一覧を表示するためのブロックタグです。",
      "Movable Type 7 では、コミュニティ機能が同梱されていないため利用できません。",
    ].join("\n"),
    "https://movabletype.jp/documentation/appendices/tags/actions.html",
    {
      sort: new LocalModifier(
        "sort",
        "アクションを並べる方法を選択します。authored_on はユーザー名順、created_on (初期値) は時系列に並べます。",
        "authored_on | created_on",
      ),
    },
  ),

  expected_tag2: new Tag(
    "MTEntryIfExtended",
    "block",
    [
      "記事の続きが入力されているときに実行する条件タグです。",
      "Movable Type 3.3 以降では、MTIf ブロックタグを利用した方法を推奨しています。",
      '<mt:If tag="EntryMore">...</mt:If>',
    ].join("\n"),
    "https://www.movabletype.jp/documentation/appendices/tags/entryifextended.html",
    {},
  ),
  expected_modifier: new GlobalModifier(
    "capitalize",
    "1 を指定すると、モディファイアを付与したファンクションタグの値に含まれる単語の最初の文字を大文字に変更し、残りの文字を小文字に変換します。",
    "https://www.movabletype.jp/documentation/appendices/modifiers/capitalize.html",
  ),
  expected_modifier2: new GlobalModifier(
    "_default",
    "モディファイアを付与したファンクションタグの値が空になる場合に、代わりに出力する値を指定できます。",
    "https://www.movabletype.jp/documentation/appendices/modifiers/default.html",
  ),
};
