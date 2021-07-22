import * as dotenv from 'dotenv';
import * as rssParser from 'rss-parser';
import * as thecamp from 'the-camp-lib';

async function getNews() {
  const parser = new rssParser();

  const xml = 'https://news.google.com/rss?gl=KR&hl=ko&ceid=KR:ko';
  const feed = await parser.parseURL(xml);

  let message = '';
  feed.items!.forEach((item) => {
    const { title } = item;
    if (title && item.title.length > 20) {
      message = `${message}<br># ${title}`;
    }
  });

  return message;
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

  const message = new thecamp.Message(
    `[3소대/구생활관] 구글뉴스포곰돌! 🐣 ${new Date().getMonth() + 1}월 ${new Date().getDate()}일 종합 뉴스 (${new Date().getHours()}시 ${new Date().getMinutes()}분)`,
    await getNews(),
    trainee
  );

  await thecamp.sendMessage(cookies, trainee, message);
};

(async () => {
  dotenv.config();

  const id = process.env.USER_ID || '';
  const password = process.env.USER_PWD || '';

  const name= process.env.TRAINEE_NAME || '';
  const birth= process.env.TRAINEE_BIRTH || '';

  //const name_sh = process.env.TRAINEE_NAME_SH || '';
  //const birth_sh = process.env.TRAINEE_BIRTH_SH || '';

  const enterDate = process.env.ENTER_DATE || '';
  const className = process.env.CLASS_NAME as thecamp.SoldierClassName;
  const groupName = process.env.GROUP_NAME as thecamp.SoldierGroupName;
  const unitName = process.env.UNIT_NAME as thecamp.SoldierUnitName;

  await send({ id, password, name: name, birth: birth, enterDate, className, groupName, unitName });
  //await send({ id, password, name: name_sh, birth: birth_sh, enterDate, className, groupName, unitName });
})();
