import { createAccountsDocument, initOrUpdateContacts } from '../lib/ceramicFunctions';

const CeramicComponent = () => {
    const handleClick1 = async () => {
        console.log('clicked, authenticateDid');

        await createAccountsDocument(['0x56696de9b1381c1268f1DBcAa0C3703666adB839']);
    };

    const handleClick2 = async () => {
        console.log('clicked2');
        await initOrUpdateContacts(['acc1', 'acc2', 'acc3', 'acc4', 'acc5']);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <h1
                    onClick={() => void handleClick1()}
                    className="text-slate-900 dark:text-white text-2xl text-base font-medium tracking-tight"
                >
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
                <p onClick={() => void handleClick2()} className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Descrition Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum beatae corporis et
                    asperiores explicabo eum, animi deleniti quod possimus officia fuga consequuntur facere cumque
                    fugiat nesciunt quos labore vero expedita?
                </p>
            </div>
        </>
    );
};

export default CeramicComponent;
