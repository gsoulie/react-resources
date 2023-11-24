"use client"
import React from 'react'
import { DataParams } from './page';
import { Filters } from './filters';

export const TestPageClient = (props: { apiEndpoint: string; data: DataParams }) => {
  console.log("TestPageClient props", props);
  return (
    <div style={{display: 'flex'}}>
      <Filters totalResults={props.data.total ?? 0} filters={props.data} />
      <div style={{marginLeft: '50px'}}>
        {props.data.items.map(d => (
          <div key={d.id} style={{display: 'flex', flexDirection: 'column'}}>
            <ul>
              <li style={{color: 'black'}}>name : {d.name}</li>
              <li style={{color: 'black'}}>supplier : {d.supplier}</li>
              <li style={{color: 'black'}}>page : {d.page}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
