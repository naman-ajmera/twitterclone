import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Spinner } from "react-bootstrap";
import Tweet from "../components/Tweet";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const HomeScreen = () => {
  const [tweets, setTweets] = useState({data:[]});
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
      .get("https://api.jsonbin.io/b/622c584b061827674374d527")
      .then((response:any) => {
        tweets.data = response.data
        setTweets({...tweets});
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossClicked]);

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
      tweets.data = tweets.data.filter(
        (tweet: any) =>
          tweet.publishedDate >= e[0] &&
          tweet.publishedDate <= e[1]
      )
      setTweets({...tweets})
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
      {tweets.data && tweets.data.length !== 0
        ? tweets.data.map((tweet: any) => (
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
