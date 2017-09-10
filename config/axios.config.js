const baseURL = 'http://localhost:5000';
export default {
    language: {
        baseURL,
        endPointIds: {
            default: {
                id: 'lang',
                prePost: (data) => (data),
                preParam: (param) => (param),
                response: (response) => (response)
            }
        }
    },
    home: {
        baseURL,
        endPointIds: {
            lang: {
                id: 'map',
                prePost: (data) => {
                    console.log(data);
                    return data;
                },
                preParam: (param) => {
                    return param;
                },
                response: (response) => {
                    console.log(response, '===================');
                    return response;
                }
            }
        }
    }
};
