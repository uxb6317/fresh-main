/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { Handlers, PageProps } from "https://deno.land/x/fresh@1.0.0/server.ts";
import Deck from "../islands/Deck.tsx";

export interface Card {
  cost: number;
  dbfId: number;
  hideCost: boolean;
  id: string;
  name: string;
  set: string;
  text: string;
  type: string;
}

export interface CardsMap {
  [dbfId: string]: Card;
}

export const handler: Handlers<Card[] | null> = {
  async GET(_, ctx) {
    const resp = await fetch(
      "https://api.hearthstonejson.com/v1/142295/enUS/cards.json"
    );
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const cards: Card[] = await resp.json();
    return ctx.render(cards);
  },
};

export default function Home({ data }: PageProps<Card[] | null>) {
  if (!data) {
    return <h1>wat</h1>;
  }

  const cardsMap: CardsMap = {};
  data.forEach((c) => {
    cardsMap[c.dbfId] = c;
  });

  return (
    <div class={tw`max-w-xl w-full my-4 mx-auto`}>
      <Deck
        cards={cardsMap}
        code={
          "AAECAZICDOTuA7CKBLWKBImLBKWNBO+kBMqsBKWtBISwBMeyBI21BJfvBA7A7APG+QOsgASvgASwgASJnwSunwTanwTPrAT/vQSuwASn1ATaoQWKugUA"
        }
      />
    </div>
  );
}
