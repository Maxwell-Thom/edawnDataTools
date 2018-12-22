import React from 'react'
import ReactDOM from 'react-dom'
import CommentDetail from './CommentDetail'
import ApprovalCard from './ApprovalCard'
import Faker from 'faker'

const App = () => {
  return (
    <div className="ui container comments">
    <ApprovalCard>
        <CommentDetail
          author={Faker.name.firstName()}
          timeAgo={Faker.date.past()}
          content={Faker.hacker.phrase()}
          avatar={Faker.image.avatar()}
        />
      </ApprovalCard>
      <ApprovalCard>
          <CommentDetail
            author={Faker.name.firstName()}
            timeAgo={Faker.date.past()}
            content={Faker.hacker.phrase()}
            avatar={Faker.image.avatar()}
          />
        </ApprovalCard>
        <ApprovalCard>
            <CommentDetail
              author={Faker.name.firstName()}
              timeAgo={Faker.date.past()}
              content={Faker.hacker.phrase()}
              avatar={Faker.image.avatar()}
            />
          </ApprovalCard>
    </div>
  );
};

ReactDOM.render( <App />,  document.querySelector('#root') );
