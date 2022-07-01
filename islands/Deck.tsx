// islands/Countdown.tsx

/** @jsx h */
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import deckstrings from "https://cdn.skypack.dev/deckstrings";
import { CardsMap, Card } from "../routes/index.tsx";
import { tw } from "@twind";

interface DecodedDeck {
  cards: number[][];
  heroes: number[];
  format: number;
}

const codes = [
  {
    name: "MURLOC WARLOCK",
    code: "AAECAa35AwKT6AP1xwQOlOgDtZ8EoqAEq6AE26AE9LEE1bIEvrQEgLUE470EssEEnMcE7tME/tgEAA==",
  },
  {
    name: "ELEMENTAL SHAMAN",
    code: "AAECAaoIAob6A8ORBA7g7APh7AOt7gOv7gPj7gOU8APA9gPB9gPTgAS5kQSVkgTblASywQTGzgQA",
  },
  {
    name: "RENATHAL CELESTIAL DRUID",
    code: "AAECAZICDOTuA7CKBLWKBImLBKWNBMqsBKWtBISwBMeyBI21BL/OBJfvBA7A7APR9gPG+QOsgASvgASwgASJnwSunwTanwTPrAT/vQSuwASywQTaoQUA",
  },
  {
    name: "NAGA FACE HUNTER",
    code: "AAECAR8C5e8DhskEDtzqA/f4A8X7A8OABPaPBLugBOGkBJ2wBO2xBIiyBOG1BOC5BIHJBL/TBAA=",
  },
  {
    name: "STASH THIEF ROGUE",
    code: "AAECAaIHBqH5A/uKBMeyBNi2BNu5BIukBQyq6wP+7gO9gAT3nwS6pAT7pQTspwT5rAS3swSZtgTVtgT58QQA",
  },
];

export default function Deck(props: { code: string; cards: CardsMap }) {
  const [deck, setDeck] = useState<{ card: Card; qty: number }[]>([]);
  const [deckCode, setDeckCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setCode(props.code);
  }, []);

  const setCode = (code: string) => {
    try {
      const decodedDeck: DecodedDeck = deckstrings.decode(code);
      setDeck(
        decodedDeck.cards.map((card) => {
          return { card: props.cards[card[0]], qty: card[1] };
        })
      );
      setDeckCode(code);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleCode = ({
    currentTarget,
  }: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setCode(currentTarget.value);
  };

  const copyTextToClipboard = ({
    currentTarget,
  }: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
    if (isValid) {
      currentTarget.select();
      if ("clipboard" in navigator) {
        return navigator.clipboard.writeText("( ͡❛ ͜ʖ ͡❛)");
      } else {
        return document.execCommand("copy", true, "( ͡❛ ͜ʖ ͡❛)");
      }
    }
  };

  return (
    <Fragment>
      <div>
        <input
          placeholder="Paste a code..."
          onInput={handleCode}
          onClick={copyTextToClipboard}
          value={deckCode}
          class={tw`w-full border p-1 ${
            isValid ? "border-green-500" : "border-red-500"
          }`}
          type="text"
        />
        {isValid && <p class="my-4">Click the code to copy!</p>}
        <div class={tw`flex`}>
          <div class={tw`flex flex-col space-y-1 border p-1 flex-1 mr-4`}>
            {deck.map(({ card, qty }) => (
              <div
                class={tw`h-10 w-full flex items-center text-gray-100 bg-gray-800 hover:bg-gray-600`}
              >
                <p class={tw`font-semibold w-8/12 truncate px-2`}>
                  {card.name}
                </p>
                <p class={tw`pr-2 text-xs`}>x{qty}</p>
                <div
                  class={tw`h-full w-4/12 bg-cover bg-no-repeat bg-right`}
                  style={{
                    backgroundImage: `url("https://art.hearthstonejson.com/v1/tiles/${card.id}.webp")`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div>
            <p class={tw`border-b font-bold`}>Decks to try</p>
            <ul>
              {codes.map((c) => (
                <li
                  onClick={(e) => setCode(c.code)}
                  class={tw`cursor-pointer ${
                    c.code === deckCode && "font-bold"
                  }`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
