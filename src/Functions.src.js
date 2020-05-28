import React, { Component } from 'react';

export function DisplayKeyword(props) {
  const keyword = props.keyword;
  let urlkeyword = "/post/search-by-key-words/" + keyword;
  return <button type="button" className="btn bg-light keyword"><a href={urlkeyword} >#{keyword}</a></button>;
}

export function LinkModifyPost(props){
  const id = props.id;
  let urlId = "/post/update/" + id;
  return <button type="button" className="btn bg-light"><a href={urlId} >Modifier</a></button>;
}
export function Link_DELETE_Post(req){
  const id = req.body.id;
  console.log("Function DELETE id :"+id)
  let urlId = "/post/DELETE/" + id;
  return <button type="button" className="btn bg-light"><a href={urlId} >DELETE</a></button>;
}