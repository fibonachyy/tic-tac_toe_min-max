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

function bestMove() {
  let bestScore = -Infinity;
  let move = {};
  let allChoice = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        allChoice.push({
          parent: _.cloneDeep(board),
          Child: _.cloneDeep(score[1]),
        });
        board[i][j] = "";

        if (score[0] > bestScore) {
          bestScore = score[0];
          move = { i, j };
        }
      }
    }
  }
  console.log(move);

  board[move.i][move.j] = ai;
  // addStep(_.cloneDeep(board), allChoice);
  currentPlayer = human;
}

let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

// function minimax(board, depth, isMaximizing) {
//   let humanMove = {};
//   let result = checkWinner();
//   if (result !== null) {
//     return scores[result];
//   }

//   var bestScore = -Infinity;
//   if (isMaximizing) {
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (board[i][j] === "") {
//           board[i][j] = ai;
//           console.log(board, depth + 1, false);
//           let score = minimax(board, depth + 1, false);
//           // humanMove[convertBoardId(board)] = {
//           //   parent: _.cloneDeep(board),
//           //   child: _.cloneDeep(score.at(1)),
//           // };
//           board[i][j] = "";
//           bestScore = Math.max(score[0], bestScore);
//         }
//       }
//     }
//   } else {
//     bestScore = Infinity;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (board[i][j] === "") {
//           board[i][j] = human;

//           let score = minimax(board, depth + 1, true);
//           // humanMove[convertBoardId(board)] = {
//           //   parent: _.cloneDeep(board),
//           //   child: _.cloneDeep(score.at(1)),
//           // };
//           board[i][j] = "";
//           console.log(score[0], bestScore);
//           bestScore = Math.min(score[0], bestScore);
//         }
//       }
//     }
//   }
//   return [bestScore, humanMove];
// }

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  console.log({ result });
  let humanMove = {};
  if (result !== null) {
    return scores[result];
  }
  var bestScore = -Infinity;
  if (isMaximizing) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          humanMove[convertBoardId(board)] = {
            ...humanMove[convertBoardId(board)],
            parent: _.cloneDeep(board),
            child: _.cloneDeep(score[1]),
          };
          board[i][j] = "";
          bestScore = max(score[0], bestScore);
        }
      }
    }
    return [bestScore, _.cloneDeep(humanMove)];
  } else {
    bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          humanMove[convertBoardId(board)] = {
            ...humanMove[convertBoardId(board)],
            parent: _.cloneDeep(board),
            child: _.cloneDeep(score[1]),
          };
          board[i][j] = "";
          bestScore = min(score, bestScore);
        }
      }
    }
    return [bestScore, _.cloneDeep(humanMove)];
  }
}
