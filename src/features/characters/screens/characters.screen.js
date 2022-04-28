import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {SafeViewComponent} from '../../../components/UI/SafeViewComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SearchBarComponent} from '../components/search-bar.component';
import {Character} from '../components/character.component';
import {DataTable} from 'react-native-paper';

Icon.loadFont();

export const getId = str => {
  const arr = str?.split('/');
  return arr[arr.length - 2];
};
export const CharactersScreen = () => {
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = useState(1);
  const numberOfItemsPerPage = 10;
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, totalCount);

  const onSearchHandler = query => {
    setSearchQuery(query);
  };

  // Need to use react query, just fetching data right now
  useEffect(() => {
    fetch(
      `https://swapi.dev/api/people/?page=${page + 1}&search=${searchQuery}`,
      {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        data.results.map(result => (result.id = getId(result?.url)));
        setCharacters(data.results);
        setTotalCount(data.count);
      });
  }, [page, searchQuery]);
  return (
    <SafeViewComponent>
      <View style={styles.container}>
        <SearchBarComponent onSearch={onSearchHandler} />
        <FlatList
          data={characters}
          renderItem={({item}) => <Character character={item} />}
          keyExtractor={item => item.name}
        />
        <DataTable style={styles.dataTable}>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(totalCount / numberOfItemsPerPage)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${totalCount}`}
            showFastPaginationControls
          />
        </DataTable>
      </View>
    </SafeViewComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dataTable: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'white',
  },
});
