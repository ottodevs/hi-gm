import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect';
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { getResolver as getKeyResolver } from 'key-did-resolver';

const API_URL = 'https://ceramic-clay.3boxlabs.com';

async function authenticateWithEthereum(ethereumProvider) {
    console.log('Authenticating for ceramic...');
    // Create a ThreeIdConnect connect instance as soon as possible in your app to start loading assets
    const threeID = new ThreeIdConnect();
    // Request accounts from the Ethereum provider
    const accounts = await ethereumProvider.request({
        method: 'eth_requestAccounts',
    });
    // Create an EthereumAuthProvider using the Ethereum provider and requested account
    const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0]);
    // Connect the created EthereumAuthProvider to the 3ID Connect instance so it can be used to
    // generate the authentication secret
    await threeID.connect(authProvider);

    const ceramic = new CeramicClient(API_URL);
    const did = new DID({
        // Get the DID provider from the 3ID Connect instance
        provider: threeID.getDidProvider(),
        resolver: {
            ...get3IDResolver(ceramic),
            ...getKeyResolver(),
        },
    });

    // Authenticate the DID using the 3ID provider from 3ID Connect, this will trigger the
    // authentication flow using 3ID Connect and the Ethereum provider
    await did.authenticate();

    // The Ceramic client can create and update streams using the authenticated DID
    ceramic.did = did;
    return ceramic;
}

// When using extensions such as MetaMask, an Ethereum provider may be injected as `window.ethereum`
async function tryAuthenticate() {
    if (window.ethereum == null) {
        throw new Error('No injected Ethereum provider');
    }
    return await authenticateWithEthereum(window.ethereum);
}

const initOrUpdateContacts = async accounts => {
    const ceramic = await tryAuthenticate();
    const streamId = 'kjzl6cwe1jw14a42onu2a527supudea9b60x7ws3wuzxmxsja7apbvlwl9urub4';

    const exDoc = await TileDocument.load(ceramic, streamId);

    // console.log('The first time it sould be {} and the second it should cointain addresses');
    // console.log('existingDoc: ', exDoc.content);

    if (exDoc.content.length > 0) {
        console.log('update ');

        await updateContactsDocument(exDoc, accounts);
    } else {
        const controller = ceramic.did._id.toString();

        //this should not be {} the second time
        const loadedDoc = await loadContactsDocumentByController(controller, ceramic);
        const loadingDocWithstreamId = await TileDocument.load(ceramic, streamId);

        console.log('loadedDoc:', loadedDoc.content);
        console.log('loadingDocWithstreamId:', loadingDocWithstreamId.content);

        //this two should be equals
        console.log('loadingDocWithstreamId.metadata.controllers[0]', loadingDocWithstreamId.metadata.controllers[0]);
        console.log('ceramic.did._id', ceramic.did._id);

        //we use this param to loadDocumentByController
        console.log('loadingDocWithstreamId.metadata.family:', loadingDocWithstreamId.metadata.family);

        await createContactsDocument(accounts);
    }
};

const initOrUpdateProfile = async profileData => {
    const ceramic = await tryAuthenticate();
    const streamId = 'kjzl6cwe1jw146vuwcrs6nhrabngjvdk5kweivi604i8mhdgi325ijuytosfbin';

    const exDoc = await TileDocument.load(ceramic, streamId);

    // console.log('The first time it sould be {} and the second it should cointain addresses');
    // console.log('existingDoc now its: ', exDoc.content);

    console.log('updating profile', profileData);

    await updateProfileDocument(exDoc, profileData);
    // if (Object.keys(profileData) > 0) {
    //     console.log('update ');

    // } else {
    //     const controller = ceramic.did._id.toString();

    //     //this should not be {} the second time
    //     const loadedDoc = await loadProfileDocumentByController(controller, ceramic);
    //     const loadingDocWithstreamId = await TileDocument.load(ceramic, streamId);

    //     console.log('loadedDoc:', loadedDoc.content);
    //     console.log('loadingDocWithstreamId:', loadingDocWithstreamId.content);

    //     //this two should be equals
    //     console.log('loadingDocWithstreamId.metadata.controllers[0]', loadingDocWithstreamId.metadata.controllers[0]);
    //     console.log('ceramic.did._id', ceramic.did._id);

    //     //we use this param to loadDocumentByController
    //     console.log('loadingDocWithstreamId.metadata.family:', loadingDocWithstreamId.metadata.family);

    //     await createProfileDocument(profileData);
    // }
};

async function loadContactsDocumentByController(controller, ceramic) {
    const a = await TileDocument.deterministic(ceramic, {
        // A single controller must be provided to reference a deterministic document
        controllers: [controller],
        // A family or tag must be provided in addition to the controller
        family: 'contacts',
        // tags: ['contacts']
    });
    console.log('current contacts ', a);
    return a;
}

async function loadProfileDocumentByController(controller, ceramic) {
    const a = await TileDocument.deterministic(ceramic, {
        // A single controller must be provided to reference a deterministic document
        controllers: [controller],
        // A family or tag must be provided in addition to the controller
        family: 'profile',
        // tags: ['contacts']
    });
    console.log('current profile ', a);
    return a;
}

const createContactsDocument = async accounts => {
    const ceramic = await tryAuthenticate();

    //Create an empty array for our accounts with our schema
    const accountsBlank = accounts.map(account => ({
        address: account,
        name: 'names',
        notes: '',
        tags: [],
    }));

    //Creates a document with our array
    console.log('Creating blank document for contacts in Ceramic...');
    const doc = await TileDocument.create(ceramic, accountsBlank, {
        family: 'contacts',
    });
    console.log(`Contacts document created with streamId: ${doc.id.toString()}`);
};

const createProfileDocument = async profileData => {
    const ceramic = await tryAuthenticate();

    //Create an empty array for our accounts with our schema
    const profileBlank = {
        name: '',
        address: '',
    };

    //Creates a document with our array
    console.log('Creating blank document for profile in Ceramic...');
    const doc = await TileDocument.create(ceramic, profileData, {
        family: 'profile',
    });
    console.log(`Profile document created with streamId: ${doc.id.toString()}`);
};

const updateContactsDocument = async (existingDoc, accounts) => {
    //creating an array with addresses already saved
    console.log('existingDoc: ', existingDoc.content);
    const existingAddresses = existingDoc.content.map(account => account.address);

    console.log('existingAddresses: ', existingAddresses);
    //comparing new with saved addresses
    const newAddressess = compareArrays(existingAddresses, accounts);
    console.log('newAddressess: ', newAddressess);

    if (newAddressess.length > 0) {
        const docToSave = existingDoc.content;
        console.log('docToSave: ', docToSave);

        //Pushing our new addresses to the ones already saved
        newAddressess.map(newAddress =>
            docToSave.push({
                address: newAddress,
                name: '',
                notes: '',
                tags: [],
            })
        );

        console.log('Updating document with new contact in ceramic');
        await existingDoc.update(docToSave);
        console.log('Document updated', existingDoc.content);
    }
};

const updateProfileDocument = async (existingDoc, newProfileData) => {
    console.log('existingDoc: ', existingDoc.content);

    const docToSave = { ...existingDoc.content, ...newProfileData };
    console.log('docToSave: ', docToSave);

    console.log('Updating document with our new addresses in Ceramic');
    await existingDoc.update(docToSave);
    console.log('Document updated', existingDoc.content);
};

const compareArrays = (arr1, arr2) => {
    // first needs to go the addresses already saved on the db
    // or the smallest array
    for (const element1 of arr1) {
        for (const element2 of arr2) {
            if (element2 == element1) {
                arr2.splice(arr2.indexOf(element2), 1);
            }
        }
    }
    return arr2;
};

export {
    createContactsDocument,
    createProfileDocument,
    initOrUpdateContacts,
    initOrUpdateProfile,
    tryAuthenticate,
    updateContactsDocument,
    updateProfileDocument,
};
