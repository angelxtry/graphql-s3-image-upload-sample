import React from 'react';
import logo from './logo.svg';
import './App.css';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const apolloCache = new InMemoryCache();

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql', // Apollo Server is served from port 4000
  headers: {
    'keep-alive': 'true',
    'Authorization': 'Baerer TOKEN'
  }
});

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink
});

const UPLOAD_FILE_STREAM = gql`
  mutation profileImageUpload($file: Upload!) {
    profileImageUpload(file: $file) {
      ETag
      Location
      Key
      Bucket
    }
  }
`;

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Stream to Server</h2>
          <Mutation mutation={UPLOAD_FILE_STREAM}>
            {(profileImageUpload, { data, loading }) => {
              console.log(data);
              return (
                <>
                  <form
                    onSubmit={() => {
                      console.log('Submitted');
                    }}
                    encType={'multipart/form-data'}
                  >
                    <input
                      name={'document'}
                      type={'file'}
                      onChange={({ target: { files } }) => {
                        const file = files[0];
                        file &&
                        profileImageUpload({ variables: { file: file } });
                      }}
                    />
                    {loading && <p>Loading.....</p>}
                  </form>
                  {data && <img
                    src={data && `${data.profileImageUpload.Location}`}
                    alt="s3"
                  />}
                </>
              );
            }}
          </Mutation>
        </header>
      </ApolloProvider>
    </div>
  );
}

export default App;
