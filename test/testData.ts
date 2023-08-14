import * as utils from "../libs/utils.ts";
import {
  BlockTag,
  FunctionTag,
  GlobalModifier,
  LocalModifier,
  Tag,
} from "../item.ts";

export const powercms_x_testData = {
  expected_gmod1: new GlobalModifier(
    "_archive_type",
    "アーカイブタイプ名を翻訳します(管理画面で利用されます)。",
    "https://powercmsx.jp/about/mtml_reference.html#global_modifiers",
  ),
  expected_gmod2: new GlobalModifier(
    "zero_pad",
    "指定した文字数になるよう、先頭の余白を0で埋めます。",
    "https://powercmsx.jp/about/mtml_reference.html#global_modifiers",
  ),
  expected_btag1: new BlockTag(
    "mtactivitymonths",
    "アクティビティが保存されている「月」をループ出力します。",
    "https://powercmsx.jp/about/mtml_reference.html#block_tags",
    {},
  ),
  expected_btag2: new BlockTag(
    "mtworkspaces",
    "'スペース' オブジェクトをループ出力します。予約変数__first__ : ループの初回に1がセットされます__last__ : ループの最終回に1がセットされます__odd__ : ループの奇数回に1がセットされます__even__ : ループの偶数回に1がセットされます__counter__ : ループのカウンター(1から始まる)__index__ : 'var'属性が与えられた時、ループのカウントがセットされます__total__ : ループの総回数がセットされます(配列またはオブジェクトの数)",
    "https://powercmsx.jp/about/mtml_reference.html#block_tags",
    {},
  ),
  expected_ctag1: new Tag(
    "mtassetiftagged",
    "undefined",
    "アセットがタグ付けされている時にブロックが評価されます。",
    "https://powercmsx.jp/about/mtml_reference.html#conditional_tags",
    {},
  ),
  expected_ctag2: new Tag(
    "mtwidgetiftagged",
    "undefined",
    "ウィジェットがタグ付けされている時にブロックが評価されます。",
    "https://powercmsx.jp/about/mtml_reference.html#conditional_tags",
    {},
  ),
  expected_ftag1: new FunctionTag(
    "mtaccesstracking",
    "アクティビティを記録します。静的出力時はJavaScriptコードを出力します。",
    "https://powercmsx.jp/about/mtml_reference.html#function_tags",
    {},
  ),
  expected_ftag2: new FunctionTag(
    "mtworkspaceuploadpath",
    "タグ 'mt:workspaceextrapath' のエイリアスです。",
    "https://powercmsx.jp/about/mtml_reference.html#function_tags",
    {},
  ),
  expected_lmod1: new LocalModifier(
    "sort_by",
    '指定のカラム値でアセットをソートする。フィールドでのソートを指定する場合"field:basename numeric"のように指定することも可能',
    "",
  ),
  expected_lmod2: new LocalModifier(
    "glue",
    "繰り返し処理の際に指定された文字列で各ブロックを連結する",
    "",
  ),
};

export const powercms_testData = {
  expected_tag1: new Tag(
    "MTAudioCustomFieldDescription",
    "function",
    "オーディオ システムオブジェクトに追加した、カスタムフィールドの概要を表示します。",
    "https://www.powercms.jp/products/document/template-tags/audiocustomfielddescription.html",
    {},
  ),
  expected_tag2: new Tag(
    "MTAssets",
    "block",
    "ブログのアイテム一覧のためのブロックタグです。モディファイアを指定することで、特定の条件にあてはまるアイテムだけを抜き出すことや、日付順で指定した数のアイテムを一覧することができます。",
    "https://www.powercms.jp/products/document/template-tags/assets.html",
    {
      lastn: new LocalModifier(
        "lastn",
        "指定した数字のアイテムを表示します。N は 0 より大きな数字にしてください。",
        "N",
      ),
      assets_per_row: new LocalModifier(
        "assets_per_row",
        "MTAssetIsFirstInRow, MTAssetIsLastInRow タグを使用して、画像の一覧を作成する際に、一行に表示するアイテム数 N 件を設定します。",
        "N",
      ),
    },
  ),
  expected_mod1: new GlobalModifier(
    "absolute",
    "URL を絶対パスに変更します。",
    "https://www.powercms.jp/products/document/modifiers/absolute.html",
  ),
  expected_mod2: new GlobalModifier(
    "zero_pad",
    "タグの値を、全体で N 文字になるよう、余白を 0 で埋めます。",
    "https://www.powercms.jp/products/document/modifiers/zero_pad.html",
  ),
};

export const movabletype_net_testData = {
  expected_tag1: new Tag(
    "MTAsset",
    "undefined",
    [
      "id モディファイアで指定した単一のアイテムを表示する為のブロックタグです。",
      "MTElse ブロックタグと組み合わせることで、条件を満たさない場合の実行内容も設定できます。",
    ].join("\n"),
    "https://movabletype.net/tags/2007/08/asset.html",
    {
      id: new LocalModifier(
        "id",
        "表示させたいアイテムの id を指定します。MTElse ブロックタグを使用している場合にid モディファイアを設定しない場合は、MTElse ブロックタグの内容を処理します。",
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
  expected_lmod1: new Tag(
    "MTIncludeBlock",
    "undefined",
    "MTInclude ファンクションタグと同じくテンプレートモジュールを読み込みます。違いは、読み込むテンプレートモジュールの所定の箇所に、MTIncludeBlock ブロックタグ内に記述した内容を差し込める点です。",
    "https://movabletype.net/tags/2015/09/mtincludeblock.html",
    {
      var: new LocalModifier(
        "var",
        'MTIncludeBlock ブロックタグで囲んだ内容を、指定した名前の変数に代入します。変数は読み込むテンプレートモジュールで参照できます。指定しない場合の初期変数名は contents です。 <mt:IncludeBlock module="banner" var="foo">Movable Type へようこそ！</mt:IncludeBlock> MTInclude ファンクションタグで以下のように記述した場合と同じ動作をします。 <$mt:Include module="banner" foo="Movable Type へようこそ！"$> ■banner テンプレートモジュールの内容 <h1><$mt:Var name="foo"$></h1><div class="asset-content entry-content" itemprop="articleBody"> <p>MovableType.net は、安全で効率的なウェブサイト運用を可能にする CMS プラットフォームです。</p></div>',
        "variable_foo",
      ),
      variable_foo: new LocalModifier(
        "variable_foo",
        '読み込むテンプレートモジュールで参照可能な変数を設定します。 例えば以下のサンプルでは、「フォームフィールド」テンプレート内で id、class、label が定義済みの変数として使用できます。id 変数の値には entry-body、class 変数の値は空、label 変数の値には 本文 が格納されます。 <mt:IncludeBlock module="フォームフィールド" id="entry-body" class="" label="本文" var="foo">Movable Type へようこそ！</mt:IncludeBlock>',
        "value",
      ),
    },
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
