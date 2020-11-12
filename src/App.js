import { useState, useEffect } from "react";

const key = process.env.REACT_APP_TRELLO_KEY;
const token = process.env.REACT_APP_TRELLO_TOKEN;

function App() {
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [lists, setLists] = useState([]);
  const [listId, setListId] = useState(null);
  const [cards, setCards] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [totalEstimate, setTotalEstimate] = useState(null);

  const reset = () => {
    setLists([]);
    setCards([]);
    setListId(null);
    setTotalEstimate(null);
  };

  /** Get boards */
  useEffect(() => {
    fetch(
      `https://api.trello.com/1/members/me/boards?token=${token}&key=${key}&fields=name&customFieldItems=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return setBoards(data);
      })
      .catch((err) => console.error(err));
  }, []);

  /** Get lists and custom fields for a board */
  useEffect(() => {
    reset();

    if (boardId)
      fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?token=${token}&key=${key}&fields=name&customFieldItems=true`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          console.log(`Response: ${response.status} ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          console.log(data);
          return setLists(data);
        })
        .catch((err) => console.error(err));

    fetch(
      `https://api.trello.com/1/boards/${boardId}/customFields?token=${token}&key=${key}&fields=name&customFieldItems=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // return setLists(data);
      })
      .catch((err) => console.error(err));
  }, [boardId]);

  /** Get cards for a list */
  useEffect(() => {
    if (listId && boardId)
      fetch(
        `https://api.trello.com/1/lists/${listId}/cards?token=${token}&key=${key}&fields=name&customFieldItems=true`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          console.log(`Response: ${response.status} ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const cardData = data.map(({ id, name, ...card }) => {
            return {
              id,
              name,
              estimate:
                parseFloat(card.customFieldItems[0]?.value?.number) || null,
            };
          });
          console.log(cardData);

          const cardsEstimate = cardData.reduce((acc, curr) => {
            return acc + (curr.estimate || 0);
          }, 0);
          setTotalEstimate(cardsEstimate);
          return setCards(cardData);
        })
        .catch((err) => console.error(err));
  }, [boardId, listId]);

  return (
    <div className="max-w-3xl mx-auto text-gray-800 py-12">
      <h1 className="text-4xl font-bold w-full leading-snug">
        Trello estimate counter
      </h1>
      <p className="mb-8">Because math is hard.</p>

      <div className="flex flex-wrap">
        <div className="mb-8 w-full">
          <label htmlFor="board" className="mb-4">
            Choose a board
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 shadow-md"
              onChange={(e) => setBoardId(e.target.value)}
              id="board"
            >
              {boards.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="border-r-2 w-1/3 h-full pr-8 w-1/3">
          {lists.length ? (
            <>
              <h3 className="mb-4">Choose a list</h3>
              <ul>
                {lists.map((item) => {
                  return (
                    <li key={item.id} className="block w-full h-full mb-5">
                      <button
                        className={`block w-full py-3 px-5 shadow-md rounded-sm leading-tight text-left ${
                          listId === item.id ? "bg-green-400" : "bg-gray-100"
                        }`}
                        onClick={() => setListId(item.id)}
                      >
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        <div className="w-2/3 flex-auto pl-8">
          {cards.length ? (
            <>
              <ul>
                {cards.map((item) => {
                  return (
                    <li key={item.id} className="block w-full mb-5 h-full">
                      <span
                        className={`block w-full p-3 bg-gray-100 shadow-md rounded-sm leading-tight flex justify-between items-center`}
                      >
                        <span>{item.name}</span>
                        {item.estimate ? (
                          <span className="p-2 ml-4 bg-blue-500 text-white rounded-md font-bold">
                            {item.estimate}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <hr className="w-3/4 mx-auto mt-8 mb-4" />
              <span className="block text-center w-30 mx-auto text-gray-800">
                Total estimate:
                <br />
                <span className="text-4xl font-bold">{totalEstimate}</span>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
