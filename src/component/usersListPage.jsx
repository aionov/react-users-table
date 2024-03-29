import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import GroupList from './groupList';
import SearchStatus from './searchStatus';
import api from '../api';
import UsersTable from './usersTable';
import _ from 'lodash';
import SearchUsers from './searchUsers';

const UsersListPage = () => {
    const pageSize = 8;
    const [users, setUsers] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [professions, setProfessions] = useState();
    const [selectedProfession, setSelectedProfession] = useState();
    const [sortBy, setSortBy] = useState({ path: 'name', order: 'asc' });
    // const userId = match.params.userId;
    // const [userToRender, setUserToRender] = useState();
    const [searchByName, setSearchByName] = useState();

    useEffect(() => {
        api.users.fetchAll().then((data) => {
            setUsers(data);
        });
    }, []);

    // useEffect(() => {
    //     api.users.getById(userId).then((data) => {
    //         setUserToRender(data);
    //     });
    // }, [userId]);

    const handleDelete = (userId) => {
        setUsers((prevState) => prevState.filter((tag) => tag._id !== userId));
    };

    const handleToggleBookmark = (id) => {
        // console.log('handleToggleBookmark', id);
        const newUsers = users.map((user) => {
            if (user._id === id) {
                user.bookmark === false
                    ? (user.bookmark = true)
                    : (user.bookmark = false);
            }
            return user;
        });
        setUsers(newUsers);
    };

    useEffect(() => {
        // console.log('render');
        api.professions.fetchAll().then((data) => setProfessions(data));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProfession]);

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const handleProfessionSelect = (item) => {
        setSelectedProfession(item);
    };

    const clearFilter = () => {
        setSelectedProfession();
    };

    const handleSort = (item) => {
        // console.log('Users: handleSort', item);
        setSortBy(item);
    };

    const handleSearch = (item) => {
        console.log('onSearch:', item);
        setSearchByName(item);
    };

    const renderGroupListBox = () => {
        return (
            <>
                <GroupList
                    selectedItem={selectedProfession}
                    items={professions}
                    onItemSelect={handleProfessionSelect}
                />
                <button
                    className="btn btn-secondary mt-2"
                    onClick={clearFilter}
                >
                    Очистить
                </button>
            </>
        );
    };

    const renderUsers = (usersOnPage, countOfFilteredUsers) => {
        return (
            <div className="d-flex justify-content-center p-3">
                {professions && (
                    <div className="d-flex flex-column flex-shrink-0">
                        {renderGroupListBox()}
                    </div>
                )}
                {countOfFilteredUsers >= 0 && (
                    <div className="d-flex flex-column m-2">
                        {<SearchStatus length={countOfFilteredUsers}/>}
                        {<SearchUsers onSearch={handleSearch}/>}
                        {<UsersTable
                            users={usersOnPage}
                            onSort={handleSort}
                            selectedSort={sortBy}
                            onToggleBookmark={handleToggleBookmark}
                            onDeleteUser={handleDelete}
                        />}
                        <div className="d-flex justify-content-center">
                            <Pagination
                                itemsCount={countOfFilteredUsers}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const filterUserByName = (arr, query) => {
        console.log('filterItems', arr, query);
        return arr.filter((el) => {
            return el.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
    };

    if (users) {
        const filteredUsers =
            selectedProfession ? users.filter((user) => JSON.stringify(user.profession) === JSON.stringify(selectedProfession)) : users;
        const seachedUsers = searchByName ? filterUserByName(filteredUsers, searchByName) : filteredUsers;
        console.log('Searched users', seachedUsers);
        const sortedUsers = _.orderBy(seachedUsers, sortBy.path, sortBy.order);
        const usersOnPage = paginate(sortedUsers, currentPage, pageSize);
        const countOfFilteredUsers = seachedUsers.length;
        return renderUsers(usersOnPage, countOfFilteredUsers);
    } else {
        return <h1 className='d-flex justify-content-center'>Loading ...</h1>;
    }
};

UsersListPage.propTypes = {
    users: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    match: PropTypes.object,
    onToggleBookmark: PropTypes.func
};

export default UsersListPage;
