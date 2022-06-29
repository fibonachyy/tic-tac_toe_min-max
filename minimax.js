/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function showBOardString(newBoard) {
  let result = "";
  for (let i = 0; i <= 2; i++) {
    for (let cellRow of newBoard) {
      result += cellRow[i] !== "" ? cellRow[i] + " " : " - ";
    }
    result += "\n";
  }
  return result;
}

function convertBoardId(newBoard) {
  let result = "";
  for (let i = 0; i <= 2; i++) {
    for (let cellRow of newBoard) {
      result += cellRow[i] !== "" ? cellRow[i] : "-";
    }
  }
  return result;
}
let humanMove = {};
function myCB(board, child, currentDepth) {
  if (!humanMove[currentDepth]) humanMove[currentDepth] = {};
  if (!humanMove[currentDepth][convertBoardId(board)])
    humanMove[currentDepth][convertBoardId(board)] = [];

  humanMove[currentDepth][convertBoardId(board)] = [...child];
  //   humanMove[currentDepth][convertBoardId(board)] = [
  //     ...humanMove[convertBoardId(board)],
  //     _.cloneDeep(child),
  //   ];
}

function convertToNested(data) {
  console.log(data);
  const maxDepth = max(Object.keys(data));
  const links = [],
    edges = [];

  for (let i = maxDepth; i >= 1; i--) {
    const dataOfCurrentDepth = data[i];
    Object.entries(dataOfCurrentDepth).forEach((element) => {
      const [key, value] = element;
      value.forEach((childElement) => {
        const isAvailable = links.find(
          (item) => item.id == i + "_" + convertBoardId(childElement)
        );
        if (!isAvailable) {
          links.push({
            id: i + "_" + convertBoardId(childElement),
            label: showBOardString(childElement),
          });
          edges.push({
            from: i - 1 + "_" + key,
            to: i + "_" + convertBoardId(childElement),
          });
        }
      });
    });
  }

  return [links, edges];
}
function bestMove() {
  let bestScore = -Infinity;
  let move;
  humanMove = {};
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        board[i][j] = ai;
        let score = minimax(board, 0, false, myCB);
        board[i][j] = "";
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
          console.log({ move });
        }
      }
    }
  }

  board[move.i][move.j] = ai;
  addStep(board, move.i, move.j);
  currentPlayer = human;
  const [nodes, edges] = convertToNested(humanMove);
  console.log(nodes, edges);
  if (nodes.length < 5000) drawData(nodes, edges);
}

let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

function minimax(board, depth, isMaximizing, cb = null) {
  let result = checkWinner();
  let humanMove = [];
  if (result !== null) {
    return scores[result];
  }

  var bestScore = -Infinity;
  if (isMaximizing) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false, cb);
          humanMove = [...humanMove, _.cloneDeep(board)];
          board[i][j] = "";
          bestScore = max(score, bestScore);
        }
      }
    }
  } else {
    bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true, cb);
          humanMove = [...humanMove, _.cloneDeep(board)];
          board[i][j] = "";
          bestScore = min(score, bestScore);
        }
      }
    }
  }
  cb(board, humanMove, depth + 1);
  return bestScore;
}
