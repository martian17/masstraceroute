<h1>インターネットにおける自分の位置課題</h1>
<h1 align="center">
    <img src="https://github.com/martian17/masstraceroute/blob/main/imgs/internetmap.png?raw=true">
</h1>
SFC2021Fネットワークアーキテクチャの授業課題です。<br>
赤がホームゲートウェイ(192.168.1.1)、緑が目的サイトです。返答が"* * *"のノードは無視しました。<br>
プロバイダーはソフトバンク光です。<br><br>
node.jsでtracerouteを非同期並列実行してその結果を一旦`result.json`に保存しました。ビジュアライゼエーションはブラウザからJSONを呼び出しHTMLの`canvas`に描画しました。(<a href="https://martian17.github.io/masstraceroute/web/">半インタラクティブデモ</a>)<br><br>
バネと反重力でノードの間隔をとっています。初期値はランダムなのでたまに暴れるかもしれません。何回かリロードするときれいに広がります。
<h2>追記</h2>
少し凝ったものを作ろうと思っていたらshellなどの環境設定が意外と面倒くさく、先延ばしにしていたら結局遅れてしまいました。
遅延提出となってしまいましたが、頑張って書いたので少しでも評価していただければ嬉しいです。
