import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Spinner } from "react-bootstrap";
import Tweet from "../components/Tweet";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const HomeScreen = () => {
  const [tweets, setTweets] = useState([]);
  const [startDate, setStartDate] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ]);
  const [likedTweets, setLikedTweets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [crossClicked, setCrossClicked] = useState(false);

  useEffect(() => {
    let likedTweetsArr = localStorage.getItem("likedTweets");
    if (likedTweetsArr) {
      setLikedTweets(JSON.parse(likedTweetsArr));
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}`)
      .then((response) => {
        setTweets(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [crossClicked]);

  useEffect(() => {
    setTweets(
      tweets.filter(
        (tweet: any) =>
          tweet.publishedDate >= startDate[0] &&
          tweet.publishedDate <= startDate[1]
      )
    );
  }, [startDate, tweets]);

  const onLikeButtonClicked = (id: string) => {
    let arrTweet: string[] = [id];
    const likedTweets = localStorage.getItem("likedTweets");
    if (likedTweets) {
      const likedTweetsArr = JSON.parse(likedTweets);
      if (likedTweetsArr.includes(id)) {
        arrTweet = likedTweetsArr.filter((tweet: any) => tweet !== id);
      } else {
        arrTweet.push(...likedTweetsArr);
      }
    }
    localStorage.setItem("likedTweets", JSON.stringify(arrTweet));
    setLikedTweets(arrTweet);
  };

  const onChange = (e: any) => {
    if (e === null) {
      setStartDate([new Date(), new Date()]);
      setCrossClicked(!crossClicked);
      setLoading(true);
    } else {
      setStartDate([e[0], e[1]]);
    }
  };

  return (
    <>
      <DateRangePicker
        value={startDate}
        onChange={onChange}
        placeholder="Select Date Range"
        className="my-3"
      />
      {loading && (
        <Spinner
          animation="border"
          role="status"
          style={{
            width: "50px",
            height: "50px",
            margin: "auto",
            display: "block",
          }}
        />
      )}
      {tweets && tweets.length !== 0
        ? tweets.map((tweet: any) => (
            <Row key={tweet._id} style={{ justifyContent: "center" }}>
              <Col sm={12} md={6} lg={6}>
                <Tweet
                  likedTweets={likedTweets}
                  onLikeButtonClicked={onLikeButtonClicked}
                  tweet={tweet}
                />
              </Col>
            </Row>
          ))
        : !loading && (
            <div className="no-tweet">
              No Tweets Available for the given Date Range!!
            </div>
          )}
    </>
  );
};

export default HomeScreen;
