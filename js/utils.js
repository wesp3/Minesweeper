'use strict'

// function setMinesNeighboursCount(cellI, cellJ, mat) {
//   var minesNeighboursCount = 0;
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//       if (i < 0 || i > mat.length - 1) continue;
//       for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//           if (j < 0 || j > mat[i].length - 1) continue;
//           if (i === cellI && j === cellJ) continue;
        
//           if (gBoard[i][j].isMine) minesNeighboursCount++;
//       }
//   }
//   return minesNeighboursCount;
// }



// function printMat(mat, selector) {
//   var strHTML = '<table border="0"><tbody>';
//   for (var i = 0; i < mat.length; i++) {
//     strHTML += '<tr>';
//     for (var j = 0; j < mat[0].length; j++) {
//       var cell = mat[i][j];
//       var className = 'cell cell-' + i + '-' + j;
//       strHTML += '<td class="' + className + '">' + cell + '</td>'
//     }
//     strHTML += '</tr>'
//   }
//   strHTML += '</tbody></table>';
//   var elContainer = document.querySelector(selector);
//   elContainer.innerHTML = strHTML;
// }

// function renderCell(location, value) {
//   var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
//   elCell.innerHTML = value;
// }




// function printPrimaryDiagonal(squareMat) {
//   for (var d = 0; d < squareMat.length; d++) {
//       var item = squareMat[d][d];
//       console.log(item);
//   }
// }



// function printSecondaryDiagonal(squareMat) {
//   for (var d = 0; d < squareMat.length; d++) {
//       var item = squareMat[d][squareMat.length - 1 - d];
//       console.log(item);
//   }
// }


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is inclusive and the minimum is inclusive
}

