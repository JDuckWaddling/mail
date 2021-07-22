import * as dotenv from 'dotenv';
import * as rssParser from 'rss-parser';
import * as thecamp from 'the-camp-lib';

async function getNews() {
  const parser = new rssParser({
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
  });

  const xml = 'http://news.sbs.co.kr/news/ReplayRssFeed.do';
  const feed = await parser.parseURL(xml);

  const message_items = feed.items!.map((item) => {
    const { title, content } = item;
    return `# ${title}<br>${content}`;
  });
  const sliced_message_items = message_items.slice(0, message_items.indexOf('# 클로징\n8뉴스 마칩니다. 고맙습니다.'));

  return [sliced_message_items.join('<br><br>').slice(0, 1500), sliced_message_items.join('<br><br>').slice(1500, 3000)];
}

async function send({ id, password, name, birth, enterDate, className, groupName, unitName }) {
  const soldier = new thecamp.Soldier(
    name,
    birth,
    enterDate,
    className,
    groupName,
    unitName,
    thecamp.SoldierRelationship.FRIEND,
  );

  const cookies = await thecamp.login(id, password);
  await thecamp.addSoldier(cookies, soldier);
  const [trainee] = await thecamp.fetchSoldiers(cookies, soldier);

  const news = await getNews();
  const messages = news.map((item, i) => {
    return new thecamp.Message(
      `[3소대/구생활관] SBS뉴스포곰돌! 🐻 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일 (${new Date().getHours()}시 ${new Date().getMinutes()}분) - SBS 뉴스 종합 (${i + 1})`,
      item,
      trainee
    );
  });

  messages.forEach((message) => {
    thecamp.sendMessage(cookies, trainee, message);
  });
};

(async () => {
  dotenv.config();

  const id = process.env.USER_ID || '';
  const password = process.env.USER_PWD || '';

  const name_kk = process.env.TRAINEE_NAME|| '';
  const birth_kk = process.env.TRAINEE_BIRTH || '';

  //const name_sh = process.env.TRAINEE_NAME || '';
  //const birth_sh = process.env.TRAINEE_BIRTH || '';

  const enterDate = process.env.ENTER_DATE || '';
  const className = process.env.CLASS_NAME as thecamp.SoldierClassName;
  const groupName = process.env.GROUP_NAME as thecamp.SoldierGroupName;
  const unitName = process.env.UNIT_NAME as thecamp.SoldierUnitName;

  await send({ id, password, name: name_kk, birth: birth_kk, enterDate, className, groupName, unitName });
  //await send({ id, password, name: name_sh, birth: birth_sh, enterDate, className, groupName, unitName });
})();
