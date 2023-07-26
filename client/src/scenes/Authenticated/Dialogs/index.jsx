import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { setDialogs, setToogleFetching, addDialogsList } from '../../../redux/reducers/dialogsReducer';
import { getDialogs, getDialogsPage } from '../../../api/dialogs';

import DialogFragment from './components/dialogFragment';

const Dialogs = ({
        dialogsData,
        isFetching,
        setDialogs,
        setToogleFetching,
        socket,
        addDialogsList,
        currentPage,
        pages,
        authUserId
    }) => {
    useEffect(() => {
        document.title = 'Диалоги';

        fetchData();
        socket.on('updateDialog', (receiverId) => {
            if (receiverId === authUserId) {
                fetchData();
            }
        });

        return () => {
            socket.off('updateDialog');
            setDialogs([]);
            setToogleFetching(true);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await getDialogs();
            const { items, totalCount, limit, pages } = response.data;
            setDialogs(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            setToogleFetching(false);
        }
    };

    // Добавление страницы 
    const addPageBackend = async () => {
        try {
            const response = await getDialogsPage(currentPage);
            addDialogsList(response.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DialogFragment
        dialogsData={dialogsData}
        isFetching={isFetching}
        addPageBackend={addPageBackend}
        currentPage={currentPage}
        pages={pages}
        />
    );
};

const mapStateToProps = (state) => ({
    dialogsData: state.dialogs.dialogsData,
    isFetching: state.dialogs.isFetching,
    totalCount: state.dialogs.totalCount,
    currentPage: state.dialogs.currentPage,
    pages: state.dialogs.pages,
    authUserId: state.auth.authUserId
});

export default connect(mapStateToProps, {
    setDialogs,
    setToogleFetching,
    addDialogsList
})(Dialogs);