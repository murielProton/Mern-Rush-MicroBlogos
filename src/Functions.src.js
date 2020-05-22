import React, { Component } from 'react';

export function DisplayKeyword(props) {
  const keyword = props.keyword;
  let urlkeyword = "/post/search-by-key-words/" + keyword;
  return <button type="button" class="btn bg-light keyword"><a href={urlkeyword} >#{keyword}</a></button>;
}