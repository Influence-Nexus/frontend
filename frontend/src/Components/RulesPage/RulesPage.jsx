import React from "react";
import "./RulesPage.css";
import { Link } from "react-router-dom";
import crimeImg from "../Science/images/C_P.png"

export const RulesPage = ({ setHeaderShow }) => {
  setHeaderShow = true
  return (
    <div className="container Rules-div">
      <h1 className="Start-End-Phrase">Meet the Equilibrium!</h1>
      <h2 id="sub-topic">Цель игры</h2>
      <p>
        <span id="sub-paragraph">Набрать</span> как можно больше очков из 100
        возможных за одну игру. Это означает уровень изменения ситуации в лучшую
        сторону благодаря Вашей стратегии действий. Игра заканчивается, когда у
        игрока не остается больше ходов. <span id="video-span">ВИДЕО</span> с
        соответствующими действиями доступно в {" "}
        <button
          style={{
            borderRadius: "10px",
            color: "white",
            backgroundColor: "#4F75FF",
          }}
          href="/"
        >
          GUIDE
        </button>
      </p>
      <h2 id="sub-topic">Ход игры</h2>
      <p id="sub-paragraph">Игра идёт в два этапа:</p>

      <ol type="A" id="letter-sublist-uncolored">
        <li>
          <p>Ознакомление и исследование игровой ситуации.</p>
        </li>
        <li>
          <p>Воздействие на ситуацию.</p>
        </li>
      </ol>
      <div>
        <ol type="A" id="letter-list-uncolored">
          <li>
            <h2 id="list-header-h2">
              Ознакомление и исследование игровой ситуации
            </h2>
            <br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">A.1. </span>
              <p id="spanned-list-header-p">
                Описание модели, представляющей ситуации
              </p>
            </div>
            <br />
            <p>
              Игрок знакомится с ситуацией, отображающей реальную ситуацию мира.
            </p>
            <p>Представление ситуации:</p>
            <ol id="num-list-uncolored">
              <li>
                <p>
                  <strong>Модель </strong> ситуации предоставляется в виде
                  направленного знакового взвешенного графа с детерминированной
                  причинностью на дугах.
                </p>
              </li>

              <li>
                <p>
                  <strong>Узлы </strong> графа имеют номер и название, и
                  представляют собой институциональные сложные факторы реальной
                  системы.
                </p>
              </li>

              <li>
                <p>
                  <strong>Дуги </strong> графа (стрелки) выражают каузальную
                  связь между узлами графа и имеют вес от (-1) to (+1).
                </p>
              </li>

              <li>
                <p>
                  <strong>Визуализировать </strong> целевой узел, то есть узел
                  графа, который должен получить максимальную реакцию (отклик)
                  при воздействии на другие узлы модели. Целевой узел окрашен{" "}
                  <span style={{ color: "red" }}>красным цветом.</span>
                </p>
              </li>

              <li>
                <p>
                  <strong>Визуализировать </strong> узлы, на которые запрещено
                  прямое воздействие. Узлы, на которые воздействие запрещено,
                  окрашены <span style={{ color: "gray" }}>серым цветом.</span>
                </p>
              </li>
            </ol>
            <br />
            <h3 style={{ fontSize: "1.75rem" }}>
              <span
                style={{
                  fontStyle: "italic",
                  // backgroundColor: "rgb(114, 144, 255)",
                  fontSize: "1.75rem"
                }}
              >
                Пример
              </span>
              . Модель «Преступление и наказание»
            </h3>
            <br />
            <ol id="num-list-uncolored">
              <li>
                <p>
                  Модель «Преступление и наказание» описывает ситуацию с
                  регулированием воровства в обществе.
                </p>
              </li>
              <li>
                <p>Модель имеет 7 узлов:</p>
              </li>
            </ol>
            <div className="Example-crime-div">
              <img src={crimeImg} id="crime-img" />
              <ol id="num-list-uncolored">
                <li>
                  <p>
                    Наличие имущества (видимое наличие имущества, желаемого
                    ворами).
                  </p>
                </li>
                <li>
                  <p>
                    Возможность (физический доступ к имуществу, наличие
                    инструментов для взлома и т. д.).
                  </p>
                </li>
                <li>
                  <p>Воровство (фактическое завладение имуществом)</p>
                </li>
                <li>
                  <p>
                    Участие общественности (наблюдение за городом, общение между
                    соседями, сообщения о преступлениях в местных новостях).
                  </p>
                </li>
                <li>
                  <p>
                    Преступный умысел (наличие лиц, намеревающихся совершить
                    кражу).
                  </p>
                </li>
                <li>
                  <p>
                    Наказание (мера надежности и неотвратимости наказания за
                    преступления).
                  </p>
                </li>
                <li>
                  <p>
                    Присутствие полиции (регулярное видимое присутствие офицеров
                    в форме).
                  </p>
                </li>
              </ol>
            </div>

            <ol start={3} id="num-list-uncolored">
              <li>
                <p>Узлы графа соединены дугами (стрелками), имеющими вес.</p>
              </li>
              <li>
                <p>
                  Целевой узел в данной модели – узел 3 “Воровство” (“Theft”).
                  Цель управления данной ситуацией – максимально увеличить
                  реакцию узла 3 через воздействия на остальные узла модели. При
                  этом напрямую на целевой узел 3 воздействовать{" "}
                  <strong>нельзя.</strong>
                </p>
              </li>
            </ol>
            <p>
              Например, значение веса -0,8 (причинное уменьшение) на дуге,
              соединяющей узел Police_Presence с узлом Theft, может означать,
              что увеличение Police_Presence приводит (или имеет эффект; или
              вызывает...) к уменьшению Theft (и наоборот, уменьшение значения
              узла Присутствие полиции приведет к увеличению количества Краж).
            </p>
            <br /><br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">A.2. </span>
              <p id="spanned-list-header-p">
                Действия при ознакомлении с моделью ситуации
              </p>
            </div>
          </li>
          <br /><br />
          <p>Игрок может:</p>
          <br />
          <ul id="listik">
            <li>
              <p>
                <strong>Представить ситуацию.</strong> Понять значимость
                институциональных узлов (факторов) и причинно-следственных
                связей между ними. Для этого, при наведении курсора на объект
                представляется:
              </p>
              <br />
              <ul type="circle" id="players-capabilities-list">
                <li>
                  <p>перечень узлов модели;</p>
                </li>
                <li>
                  <p>название каждого узла;</p>
                </li>
                <li>
                  <p>описание причинной связи между узлами.</p>
                </li>
              </ul>
            </li>
            <br />
            <li>
              <p>
                <strong>Идентифицировать целевой узел.</strong> Визуализировать
                целевой узел (фактор), который должен получить максимальную
                реакцию (отклик) при воздействии на другие узлы модели.
              </p>
            </li>
            <br />
            <li>
              <p>
                <strong>Идентифицировать пути</strong> путем подсвечивания. Для
                восприятия возможностей передачи воздействий по дугам графа
                можно проследить любой путь (непрерывную последовательность дуг
                (связей) между узлами от исходного до любого узла в модели).
              </p>
            </li>
          </ul>
          <br /><br />
          <p>
            Время ознакомления с ситуацией <strong>не нормируется.</strong>
          </p>
          <br /><br />
          <li>
            <p id="list-header-h2">Воздействие на ситуацию</p>
            <br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">B.1. </span>
              <p id="spanned-list-header-p">Задача игрока</p>
            </div>
            <br />
            <p>
              Атлас Стратегос – опытный влиятельный человек, поведение которого
              отражает мудрость и расчетливый интеллект.
            </p>
            <br />
            <p>
              Вам, как стратегу и влиятельному человеку, поручено разобраться в
              тонкостях институционального комплекса.
            </p>
            <br />
            <p>
              Вы можете воздействовать на ситуацию, прилагая воздействия к узлам
              графа с целью достигнуть максимальной реакции модели. Как правило,
              у общества нет средств и возможности воздействовать сразу на все
              узлы.
            </p>
            <br />
            <p>
              Поэтому Ваша задача – в первый ход выбрать наиболее значимые, с
              Вашей точки зрения, узлы. Практически первый ход из трех узлов
              захватит почти 50% силы всех возможных воздействий на систему.
              Последующие ходы только дополнят Ваше решение.
            </p>
            <br />
            <p>
              Постарайтесь максимизировать первый ход. Он определит всю Вашу
              стратегию и ее успех!
            </p>
            <br /><br />
            <p>
              <strong>Максимальная реакция</strong> модели – это достижение
              максимально возможной реакции модели с ориентацией на целевой
              узел. Это достигается за счет выстраивания правильной стратегии
              воздействия на узлы графа.
            </p>
            <br /><br />
            <p>
              <strong>Стратегия воздействия</strong> – это последовательность из
              узлов, выбранных Вами для воздействия на систему.
            </p>
            <p><br />
              <strong>Максимально возможная </strong>(оптимальная) реакция
              модели рассчитывается алгоритмом игры с помощью специального
              математического алгоритма -{" "}
              <Link to={"/algorithm"}>
                <button
                  style={{
                    borderRadius: "10px",
                    color: "white",
                    backgroundColor: "#4F75FF",
                    fontSize: "0.6em"
                  }}
                >
                  Algorithm
                </button>
              </Link>
              .
            </p>
            <br /><br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">B.2. </span>
              <p id="spanned-list-header-p">Правила игры</p>
            </div>
            <br /><br />
            <p style={{ textDecoration: "underline" }}>Ходы игрока: </p>
            <br />
            <ol id="num-list-uncolored">
              <li>
                <p>
                  Ход игрока – это выбор последовательности из узлов, на которые
                  будет осуществляться воздействие за один ход.
                </p>
              </li>
              <li>
                <p>
                  За один ход разрешается воздействовать не менее, чем на 3
                  узла.
                </p>
              </li>
              <li>
                <p>
                  Вы можете выбрать больше, чем 3 узла за один ход.{" "}
                  <span style={{ color: "red" }}>
                    Однако помните, что последовательность узлов очень важна!
                  </span>
                </p>
              </li>
              <li>
                <p>
                  Выбранная последовательность узлов за один ход предполагает
                  ранжирует узлы по их силе воздействия от высшего к низшему.
                </p>
              </li>
            </ol>
            <br /><br />
            <span
              style={{
                fontStyle: "italic",
                backgroundColor: "rgb(114, 144, 255)",
                fontSize: "1.7rem",
              }}
            >
              Пример
            </span>
            <p>
              Модель «Преступление и наказание» включает 7 узлов. Значит Вы
              имеете <strong>2 хода</strong>.
            </p>
            <br />
            <p>
              <span style={{ fontStyle: "italic" }}>Первый ход </span> – выбор
              первой последовательности из трех узлов. Например, вы указали
              последовательность 2,7,4. Это означает то, что Вы считаете, что
              именно эти три узла обеспечат максимальное воздействие на систему.
              Кроме этого, сила воздействия узла 2 больше, чем узла 7; узла 7
              больше, чем узла 4. То есть, узлу 2 присваивается первый ранг,
              узлу 7 – второй ранг, узлу 4 – третий ранг.
            </p>
            <br />
            <p>
              <span style={{ fontStyle: "italic" }}>Второй ход </span> - выбор
              второй последовательности. В данном случае остается для
              воздействия четыре узла, так как меньше 3-х выбирать не
              допускается.
            </p>
            <br /><br />
            <p style={{ textDecoration: "underline" }}>Время игры: </p>
            <ol id="num-list-uncolored">
              <li>
                <p>
                  <strong>Нормативное время </strong> игры – 600 секунд.
                </p>
              </li>
              <li>
                <p>
                  <strong>Нормативное время </strong> одного хода – отсутствует.
                </p>
              </li>
              <li>
                <p>
                  <strong>Таймер </strong> отсчитывает оставшееся время до конца
                  игры.
                </p>
              </li>
              <li>
                <p>
                  <strong>Таймер </strong> останавливает игру по истечении
                  нормативного времени игры.
                </p>
              </li>
              <li>
                <p>
                  <strong>Голубая линейка прогресс-бара </strong> отсчитывает
                  оставшееся от нормативного времени игры.
                </p>
              </li>
              <li>
                <p>
                  <strong>Космический кот </strong> предупредит Вас о ключевых
                  моментах времени.
                </p>
              </li>
              <li>
                <p>
                  <strong>Уменьшение размера </strong> представления графа
                  предупреждает Вас о времени.
                </p>
              </li>
            </ol>
            <br /><br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">B.3. </span>
              <p id="spanned-list-header-p">Подсчет очков</p>
            </div>
            <br />
            <p style={{ textDecoration: "underline" }}>
              Правила подсчета очков
            </p>
            <p>За каждый ход вы получаете очки по 100-балльной шкале:</p>
            <ol id="num-list-uncolored">
              <li>
                <p>
                  За правильно указанные ранги узлов – вычисляется специальным
                  математическим алгоритмом смотри <strong>B.1.</strong>
                </p>
              </li>
              <li>
                <p>
                  За неправильно указанные ранги узлов – минус 10% от баллов по
                  пункту 1.
                </p>
              </li>
              <li>
                <p>
                  За близкий выбор к правильному рангу узлов –плюс от 20% до 50%
                  от баллов по пункту 1.
                </p>
              </li>
              <li>
                <p>
                  За близкий выбор первых двух узлов – плюс 50% от баллов по
                  пункту 1.
                </p>
              </li>
            </ol>
            <br />
            <p>Баллы начисляются по каждому узлу и затем суммируются.</p>
            <br />
            <p style={{ textDecoration: "underline" }}>Табло очков:</p>
            <ul type="disc" id="disc-list-uncolored">
              <li>
                <p>Номер хода</p>
              </li>
              <li>
                <p>Последовательность выбранных узлов за каждый ход.</p>
              </li>
              <li>
                <p>Время хода.</p>
              </li>
              <li>
                <p>Количество набранных очков.</p>
              </li>
            </ul>
            <br />
            <div id="sub-list-colored-div">
              <span id="sub-list-colored-span">B.4. </span>
              <p id="spanned-list-header-p">Конец игры</p>
            </div>
            <p>Игра заканчивается сразу после последнего возможного хода.</p>
          </li>
        </ol>
        <h1 className="Start-End-Phrase">
          Good luck to you!
        </h1>
      </div>
    </div>
  );
};

