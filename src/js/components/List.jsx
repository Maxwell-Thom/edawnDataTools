// src/js/components/List.jsx
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { caspioViews: state.caspioViews,
          caspioTables: state.caspioViews };
};

const ConnectedList = ({ articles }) => (
  <ul className="list-group list-group-flush">
    {articles.map(el => (
      <li className="list-group-item" key={el.id}>
        {el.title}
      </li>
    ))}
  </ul>
);

const List = connect(mapStateToProps)(ConnectedList);
export default List;

//or

// export default connect(
//   (state) => ({
//     caspioViews: state.caspioViews,
//     caspioTables: state.caspioViews,
//   })
// )(ConnectedList);
