import {
  GET_ALL_BOOKS,
  SORT_BY_PRICE,
  SORT_BY_RATING,
  GET_BOOKSPAGE,
  CHANGE_PAGINA,
  SEARCH_BY_NAME_OR_AUTHOR,
  SET_DETAIL,
  FILTER_BY_GENRE,
  FILTER_AUTHOR,
  POST_BOOK,
  CREATE_USER,
  FILTER_FLAG,
  RESET_FILTERS,
  GET_AUTORES,
  GET_GENEROS,
  GET_REVIEWS_BOOK,
  POST_REVIEW,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_REVIEWS_BY_USER,
  PUT_BOOK,
  PUT_REVIEW,
  DELETE_REVIEW,
  DELETE_BOOK,
  UPDATE_USER,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REMOVE_ITEMS,
  EMPTY_CART,
  GET_ALL_USERS,
  DELETE_USER,
  FILL_CART,
  FILTER_USER_PROFILE,
  FILTER_USER_STATE,
  GET_ALL_SHOPPING,
  CREATE_ORDER,
  GET_BOOK_BY_ID,
  GET_USER_BY_ID,
  CANCEL_SUSCRIPTION,
  EDIT_ORDER,
  FILTER_ORDER_STATE,
  CREATE_GENRE,
  CREATE_AUTHOR
} from './action';
import swal from 'sweetalert';

// Initial state
const initialState = {
  //detail_data es en donde se guarda la data para renderizar en detail, tanto del searchbar como al clickear una portada. 
  detail_data: undefined,
  //slice del Allbooks con la pagina pedida
  booksPage: [],
  //Representa el número de página que se renderiza en Posters
  paginaActual: 1,
  //books sirve para renderizar los filtrados
  books: [],
  //array original de todos los libros
  allBooks: [],
  //Flag para saber si se esta filtrando
  filterFlag: false,
  //Array de géneros
  generos: [],
  //Array de autores
  autores: [],
  //array que trae todas la opinión de un libro
  reviewsBook: [],
  //Objeto con los datos del usuario logueado
  user: null,
  //array que trae todas la opinión de un usuario
  userReviews: [],
  //array de la busqueda
  searchData: [],
  //array para el carrito
  cart: [],
  //Array todos los Usuarios
  allUsers: [],
  //Array usuarios filtrados.
  filteredUsers: [],
  //Array historial de compras
  allOrders: [],
  // Ordenes filtradas.
  filteredOrders: [],
  //traigo detalle de libro por id
  bookById: {},
  //trae info completa de un usuario por id
  userById: {},
}

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOOKS:

      let notDeletetedBooksArray = action.payload.filter((book) => {
        return book.deleted === false
      })

      return {
        ...state,
        books: notDeletetedBooksArray,
        allBooks: action.payload
      };

    // case CHANGE_PAGINA:
    //   return {
    //     ...state,
    //     paginaActual: action.payload,
    //     detail_data: undefined, // elimino pagina detalle
    //   };

    case CHANGE_PAGINA:
      return {
        ...state,
        detail_data: undefined, // elimino pagina detalle
      };

    case GET_BOOKSPAGE:
      const pageSize = 9;
      const pageNumber = action.payload
      const indiceInicio = (pageNumber - 1) * pageSize;
      const indiceFinal = indiceInicio + pageSize;
      let notDeletetedBooks;

      if (state.searchData.length > 0) {
        notDeletetedBooks = state.searchData.filter((book) => {
          return book.deleted === false
        })

        return {
          ...state,
          booksPage: notDeletetedBooks.slice(indiceInicio, indiceFinal)
        }
      } else {
        notDeletetedBooks = state.allBooks.filter((book) => {
          return book.deleted === false
        })
        return {
          ...state,
          booksPage: notDeletetedBooks.slice(indiceInicio, indiceFinal)
        };
      }

    // case SORT_BY_PRICE:
    //   let arrayOrdenPrecio = state.filterFlag ? state.books : state.booksPage
    //   let sortPriceArray = action.payload === 'Asc' ? arrayOrdenPrecio.sort((a, b) => {
    //     return a.price - b.price
    //   }) :
    //     arrayOrdenPrecio.sort((a, b) => {
    //       return b.price - a.price
    //     });
    //   const returnPriceProp = state.filterFlag ? "books" : "booksPage"
    //   return {
    //     ...state,
    //     [returnPriceProp]: [...sortPriceArray]
    //   }

    case SORT_BY_PRICE:
      let sortArray = action.payload === 'Asc' ?
            state.books.sort((a, b) => {
               return a.price - b.price
            }) :
            state.books.sort((a, b) => {
                return b.price - a.price
            });
            return  {
                ...state,
                books: [...sortArray] //asigno la referencia de sortArray y no modifico el estado original
            };

    case SORT_BY_RATING:

      const qualificationObtained = (book) => {
        const reviews = book.reviews
        const notDeletedReviews = reviews.filter(review => !review.deleted)
        if (notDeletedReviews && Array.isArray(notDeletedReviews) && notDeletedReviews.length > 0) {
          let sum = 0;
          for (let i = 0; i < notDeletedReviews.length; i++) {
            sum += notDeletedReviews[i].qualification;
          }
          let average = sum / notDeletedReviews.length;
          return Math.round(average);
        }
        return 0; // Valor predeterminado si no hay reviews o no es un array válido
      };

      let booksCopy = [...state.books]
      let booksTotalQualification = booksCopy.map(book => ({ ...book, totalQualification: qualificationObtained(book) }))

      let sortRatingArray = action.payload === 'Asc' ? booksTotalQualification.sort((a, b) => {
        return a.totalQualification - b.totalQualification
      }) :
      booksTotalQualification.sort((a, b) => {
          return b.totalQualification - a.totalQualification
        });
     
      return {
        ...state,
        books: [...sortRatingArray]
      }

    case SEARCH_BY_NAME_OR_AUTHOR:
      const deletedFilter = action.payload.filter(book => !book.deleted)
      return {
        ...state,
        books: deletedFilter
      }
//comentario
    case SET_DETAIL:
      console.log( action.payload);
      return {
        ...state,
        detail_data: action.payload,
      };

    case FILTER_BY_GENRE:
      { 
        const genreFiltered = action.payload === 'All' ?
          state.allBooks.filter(book => !book.deleted)
           : 
          state.books
          .filter(book => !book.deleted)
          .filter(libro => {
            if (libro.genders.length > 0) {
              if (libro.genders.find(genero => genero === action.payload)) return libro
            }
          })
        return {
          ...state,
          books: genreFiltered
        }
      }

    case FILTER_AUTHOR: {
      const authorsFiltered = action.payload === 'All' ?
        state.allBooks.filter(book => !book.deleted) 
        :
        state.books
        .filter(book => !book.deleted)
        .filter(libro => {
          if (libro.authors.length > 0) {
            if (libro.authors.find(autor => autor === action.payload)) return libro
          }
        })
      return {
        ...state,
        books: authorsFiltered
      }
    }

    case POST_BOOK:
      console.log('entra en el reducer');
      return { ...state }

    case CREATE_USER:
      return { ...state }

    case FILTER_FLAG:
      return {
        ...state,
        filterFlag: action.payload,
      }

    case RESET_FILTERS:
      //console.log("entra el reducer de redux")
      return {
        ...state,
        searchData: [],
        books: state.allBooks
      }

    //no se guarda en los arrays autores y generos.
    case GET_GENEROS:
      //console.log("entra al reducer el get generos")
      const genresNoRepeat = state.books
        .flatMap(book => book.genders)
        .filter((genre, index, self) => self.findIndex(g => g === genre) === index);

      //console.log(genresNoRepeat)

      const sortGenres = genresNoRepeat.sort((a, b) => {
        if (a > b) { return 1 }
        if (b > a) { return -1 }
        return 0
      })
      return {
        ...state,
        generos: sortGenres
      }

    case GET_AUTORES:

      const authorsNoRepeat = state.books
        .flatMap(book => book.authors)
        .filter((aut, index, self) => self.findIndex(a => a === aut) === index);

      const sortAuthors = authorsNoRepeat.sort((a, b) => {
        if (a > b) { return 1 }
        if (b > a) { return -1 }
        return 0
      })
      return {
        ...state,
        autores: sortAuthors
      }

    //trae todas las reviewsde un libro
    case GET_REVIEWS_BOOK:
      return {
        ...state,
        reviewsBook: action.payload.reviews
      }

    case POST_REVIEW:
      const newEstado = [...state.allBooks]
      const book = newEstado.find((b) => b.id === action.payload.id_book)
      if (!book) {
        return state
      }
      book.reviews.push(action.payload)
      return {
        ...state,
        books: newEstado,
        allBooks: newEstado
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
      }

    case LOGOUT:
      return {
        ...state,
        user: null,
        userById: {}
      }

    case GET_REVIEWS_BY_USER:
      return {
        ...state,
        userReviews: action.payload.reviews
      }

    case PUT_BOOK:
      const nState = [...state.allBooks]
      const newState = nState.sort((a, b) =>
        a.id > b.id ? 1 : -1
      )
      const bookIndex = newState.findIndex(book => book.id === action.payload.id)
      newState[bookIndex] = action.payload
      return {
        ...state,
        allBooks: newState
      }

    case PUT_REVIEW:
      //console.log('entra la action en el reducer')
      return {
        ...state
      }

    case DELETE_REVIEW:
      //console.log('entra la action en el reducer');
      return {
        ...state
      }

    case DELETE_BOOK:
      return {
        ...state
      }

    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }

    case ADD_TO_CART:
      const cartCopy = [...state.cart]
      const findItemIndex = cartCopy.findIndex(i => i.id === action.payload.id);
      if (findItemIndex !== -1) {
        const findItem = cartCopy[findItemIndex];
        if (findItem.quantity < findItem.stock) {
          findItem.quantity += 1;
        } else {
          swal({
            title: "¡No hay stock suficiente!",
            text: "Pronto renovaremos stock...",
            icon: "warning",
            timer: 2000,
            buttons: false
          });
        }
      } else {
        const { id, price, stock, title } = action.payload
        cartCopy.push({ id, price, stock, title, quantity: 1 });
      }
      return {
        ...state,
        cart: cartCopy,
      }

    case REMOVE_FROM_CART:
      const cartCopi = [...state.cart]
      const findI = cartCopi.find(i => i.id === action.payload.id)
      if (findI && findI.quantity > 1) {
        findI.quantity -= 1
        return {
          ...state,
          cart: cartCopi
        }
      }
      if (findI && findI.quantity === 1) {
        const filterItem = cartCopi.filter(i => i.id !== action.payload.id)
        return {
          ...state,
          cart: filterItem
        }
      }
      return {
        ...state
      }

    case REMOVE_ITEMS:
      const deletedItem = state.cart.filter(i => i.id !== action.payload)
      return {
        ...state,
        cart: [...deletedItem]
      }

    case EMPTY_CART:
      return {
        ...state,
        cart: []
      }

    case FILL_CART:
      //console.log('entra el reducer');
      return {
        ...state,
        cart: action.payload
      }

    case GET_ALL_USERS:
      return {
        ...state,
        filteredUsers: action.payload,
        allUsers: action.payload
      };

    case DELETE_USER:
      return {
        ...state
      }


    case FILTER_USER_PROFILE:
      // console.log("🚀 ~ file: reducer.js:394 ~ reducer ~ action.payload:", action.payload)

      const usersFilteredByProfile =
        action.payload === 'All' ? state.allUsers :
          state.allUsers.filter(user => {
            if (user.profile === action.payload) return user
          })


      // console.log("🚀 ~ file: reducer.js:401 ~ reducer ~ usersFilteredByProfile:", usersFilteredByProfile)

      return {
        ...state,
        filteredUsers: usersFilteredByProfile
      }

    case FILTER_USER_STATE:
      const usersFilteredByState = action.payload === 'All' ?

        state.allUsers : state.allUsers.filter(user => {
          if (user.state === action.payload) return user
        })

      // console.log("🚀 ~ file: reducer.js:416 ~ reducer ~ usersFilteredByState:", usersFilteredByState)

      return {
        ...state,
        filteredUsers: usersFilteredByState
      }

    case CREATE_ORDER:
      return {
        ...state
      }

    case GET_ALL_SHOPPING:
      return {
        ...state,
        allOrders: action.payload,
        filteredOrders: action.payload
      }

    case GET_BOOK_BY_ID:
      return {
        ...state,
        bookById: action.payload
      }

    case GET_USER_BY_ID:
      //console.log('entra en el reducer');
      return {
        ...state,
        userById: action.payload
      }

    case CANCEL_SUSCRIPTION:
      //console.log('entra la action en el reducer de desuscripcion');
      return {
        ...state,
        // userById: { ...state.userById }
      }
    case EDIT_ORDER:
      return {
        ...state,
      }

    case FILTER_ORDER_STATE:
      const ordersFilteredByState = action.payload === 'All' ?

        state.allOrders : state.allOrders.filter(order => {
          if (order.state === action.payload) return order
        })

      return {
        ...state,
        filteredOrders: ordersFilteredByState
      }

    case CREATE_GENRE:
      return {
        ...state,
      }

    case CREATE_AUTHOR:
      return {
        ...state,
      }

    default:
      return state;
  }
}

export default reducer;
