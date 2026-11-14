(() => {
  const main = document.getElementById('report');
  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  async function render() {
    const data = await studyStore.request('/api/data');
    const list = Number(new URL(location.href).searchParams.get('list'));
    const unit = data.lists.find(unit => unit.id === list);
    if (!unit) throw Error('找不到这个 LIST，请从词库重新打开');
    const words = unit.words.filter(word => data.progress[word.id] === 'unknown');
    document.title = `${unit.title}_还不会_紧凑四栏词表`;
    main.replaceChildren(element('h1', `${unit.title} 还不会词表`),
      element('p', `${words.length} Words / 4 Columns / 雅思3000词`, 'subtitle'),
      element('p', '单词、关联词、释义及例句均摘自词书；英文 Times New Roman，中文宋体。', 'description'));
    if (words.length) {
      const table = document.createElement('table');
      const group = document.createElement('colgroup');
      for (let i = 0; i < 4; i++) group.append(document.createElement('col'));
      table.append(group);
      const head = table.createTHead().insertRow();
      ['单词', '书中关联词', '中文释义', '书中例句'].forEach(text => head.append(element('th', text)));
      const body = table.createTBody();
      words.forEach((word, index) => {
        const row = body.insertRow();
        [`${word.word}\n${String(index + 1).padStart(2, '0')} / 原书第 ${word.page} 页`,
          word.related || '—', word.meaning + (word.note ? '\n' + word.note : ''), word.examples || '—']
          .forEach(text => row.append(element('td', text)));
      });
      main.append(table);
    } else main.append(element('p', '这个 LIST 暂无“还不会”的单词。'));
    main.append(element('footer', `${unit.title} / ${words.length} WORDS / REVIEW`));
    const button = document.getElementById('print');
    button.disabled = false;
    button.onclick = () => window.print();
    window.reportReady = true;
  }
  render().catch(error => main.replaceChildren(element('p', '词表生成失败：' + error.message, 'error')));
})();
