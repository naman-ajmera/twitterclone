import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ITweetProps {
  tweet: any;
  onLikeButtonClicked(id: String): any;
  likedTweets: string[];
}

function Tweet(props: ITweetProps) {
  const { tweet, onLikeButtonClicked, likedTweets } = props;
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Card border={"dark"} className="my-3 p-1 rounded">
      {tweet.imageUrl && (
        <Card.Img
          height={"240px"}
          width={"240px"}
          src={tweet.imageUrl}
          variant="top"
        />
      )}
      <Card.Body>
        <Card.Title as="div">
          <Link to={`/tweet/${tweet._id}`}>
            <strong>{tweet.author}</strong>
          </Link>
          <span className="text-muted">
            {new Date(tweet.publishedDate).getDate()}{" "}
            {month[new Date(tweet.publishedDate).getMonth()]}
          </span>
        </Card.Title>
        <Card.Text as="div">
          <div className="my-3">{tweet.text}</div>
        </Card.Text>
        {/* <Card.Text as="h3">${tweet.price}</Card.Text> */}
      </Card.Body>
      <Card.Footer style={{}}>
        <span>
          <i className="far fa-comment" />
        </span>
        <span>
          <i
            onClick={() => onLikeButtonClicked(tweet._id)}
            className={
              likedTweets.includes(tweet._id) ? `fas fa-heart` : ` far fa-heart`
            }
          />{" "}
          {tweet.likes}
        </span>
        <span>
          <i className="fas fa-retweet" /> {tweet.retweets}
        </span>
      </Card.Footer>
    </Card>
  );
}

export default Tweet;
