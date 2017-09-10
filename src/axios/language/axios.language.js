export default [
    {
        method: 'get',
        endPointID: 'lang',
        prePost: (data) => {
            return data;
        },
        preQuery: (param) => {
            return param;
        },
        preHeader: () => {
            return {};
        },
        response: (res) => {
            return res;
        },
        onError: (err) => {
            console.log(err);
            return err;
        }
    }
];
