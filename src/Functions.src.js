import React, { Component } from 'react';

export function DisplayKeyword(props) {
  const keyword = props.keyword;
  let urlkeyword = "/post/search-by-key-words/" + keyword;
  return <button type="button" class="btn bg-light keyword"><a href={urlkeyword} >#{keyword}</a></button>;
}

export function LinkModifyPost(props){
  const id = props.id;
  let urlId = "/post/update/" + id;
  return <button type="button" class="btn bg-light keyword"><a href={urlId} >Modifier</a></button>;
}
export function Link_DELETE_Post(props){
  const id = props.id;
  let urlId = "/post/DELETE/" + id;
  return <button type="button" class="btn bg-light keyword"><a href={urlId} >DELETE</a></button>;
}