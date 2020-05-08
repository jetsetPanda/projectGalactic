

const postGraphQL = reqBody => {
    fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Req Failed.');
        }
        return res.json();
    }).then(resData => {
        console.log('graphQL res: ', resData);
        return resData;
    }).catch(err => {
        console.log(err)
    });
}

export default postGraphQL();