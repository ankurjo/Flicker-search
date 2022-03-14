import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import NewImageList from "./components/ImageListScreen.jsx";
import ImagePopUpNew from "./components/ImagePopUpScreen.jsx";
import constants from "./constants.js";
import {
  scrollAreaAvailable,
  debounce,
  throttle,
  checkHttpStatus,
  parseJSON,
} from "./utils.js";

const params = {
  sort: "relevance",
  extras: "owner_name,description",
};
const qs = new URLSearchParams(params);

function NewApp() {
  const queriesFromStorage = JSON.parse(
    localStorage.getItem(constants.STORAGE_KEY)
  );
  const [searchText, setSearchText] = useState("");
  const [imageList, setImageList] = useState([]);
  const [popUpImage, setPopUpImage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [queries, setQueries] = useState(
    queriesFromStorage ? queriesFromStorage : []
  );

  useEffect(() => {
    window.onscroll = throttle(() => {
      if (scrollAreaAvailable()) return;
      handleScroll();
    }, 1000);
    return () => {
      window.onscroll = undefined;
    };
  });

  const handleScroll = async () => {
    try {
      let url =
        constants.BASE_URL +
        "&text=" +
        searchText +
        "&page=" +
        (pageNumber + 1);
      fetch(url)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((resp) => {
          console.log(resp);
          setPageNumber(pageNumber);
          setImageList((prev) => [...prev, ...resp.photos.photo]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };

  const updateLocalStorage = (queriesData) => {
    localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(queriesData));
  };

  const handleImageClick = (idx) => {
    setPopUpImage(imageList[idx]);
  };

  const onPopUpHide = () => {
    setPopUpImage(null);
  };

  const fetchData = async (text) => {
    try {
      qs.set("page", pageNumber);
      if (text) {
        qs.set("text", text);
        queries.push(text);
      }
      setQueries(queries);
      updateLocalStorage(queries);

      let urlStr = `${constants.BASE_URL}?${qs}`;
      fetch(urlStr)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((resp) => {
          setPageNumber(1);
          setImageList(resp.photos.photo);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };

  const handleOptionsSearch = (text) => {
    console.log("test", text);
    fetchData(text);
  };

  const onSearchInputChange = (evt) => {
    let text = evt.currentTarget.value;
    setSearchText(text);
    debouncedSave(text);
  };

  const debouncedSave = useCallback(
    debounce((nextValue) => handleOptionsSearch(nextValue), 1000, false),
    [imageList]
  );

  return (
    <>
      <div className="app">
        <div className="app-header">
          <h2 style={{ margin: "1rem 0" }}>Flickr Search</h2>
          <div className="h-flex jc ac search-bar">
            <input
              type="text"
              className="search-input"
              value={searchText}
              onChange={(event) => onSearchInputChange(event)}
            />
          </div>
          {queries.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h5 style={{ marginBottom: "5px" }}>Recent Searches</h5>
              <ul className="h-flex jc">
                {queries.map((query, idx) => (
                  <li key={idx} className="query">
                    {query}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="app-content">
          {imageList.length ? (
            <NewImageList
              imageList={imageList}
              onImageClickProps={(event) => handleImageClick(event)}
            />
          ) : (
            <p style={{ margin: "1rem 0" }}>
              Try searching for some image in the search bar
            </p>
          )}
          <ReactCSSTransitionGroup
            transitionName="popup-container"
            transitionEnterTimeout={400}
            transitionLeaveTimeout={200}
          >
            {popUpImage && (
              <ImagePopUpNew image={popUpImage} onHide={onPopUpHide} />
            )}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    </>
  );
}

export default NewApp;
