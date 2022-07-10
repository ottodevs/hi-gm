import { connectCeramic, initOrUpdateContacts, initOrUpdateProfile } from '../lib/ceramicFunctions';

const CeramicComponent = () => {
    const handleInitialConnection = async () => {
        await connectCeramic();
        // await createProfileDocument({ name: 'Satoshi' });
        // await createContactsDocument(['random-anon']);
    };
    const handleUpdateProfile = async () => {
        await initOrUpdateProfile({
            name: 'Otto',
        });
    };

    const handleUpdateContacts = async () => {
        await initOrUpdateContacts(['satoshi']);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <h1 className="text-slate-900 dark:text-white text-2xl text-base font-medium tracking-tight">
                    Edit your Profile
                </h1>
                <div>
                    <span className="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        ></svg>
                    </span>
                </div>
                <h3 className="text-slate-900 dark:text-white mt-5 text-base font-medium tracking-tight">Title</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Descrition Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum beatae corporis et
                    asperiores explicabo eum, animi deleniti quod possimus officia fuga consequuntur facere cumque
                    fugiat nesciunt quos labore vero expedita?
                </p>
                <div className="pt-6 grid grid-rows-3 gap-4">
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                        value={'hidetaka'}
                    />
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></input>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                        placeholder=""
                    ></input>

                    <select className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0">
                        Hello
                    </select>

                    {/* <input type="checkbox" className="form-checkbox rounded text-pink-500" /> */}
                </div>
                <div className="pt-6 grid grid-cols-3 gap-4">
                    <button
                        onClick={() => void handleInitialConnection()}
                        className="bg-sky-600 hover:bg-sky-700 rounded"
                    >
                        Connect and sign
                    </button>
                    <button onClick={() => void handleUpdateProfile()} className="bg-sky-600 hover:bg-sky-700 rounded">
                        Update profile
                    </button>
                    <button onClick={() => void handleUpdateContacts()} className="bg-sky-600 hover:bg-sky-700 rounded">
                        Update contacts
                    </button>
                </div>
            </div>
        </>
    );
};

export default CeramicComponent;
