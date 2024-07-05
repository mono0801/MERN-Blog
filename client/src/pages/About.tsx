const About = () => {
    return (
        <div className="min-h-screen flex items-center">
            <div className="max-w-2xl mx-auto p-3">
                <div className="text-center">
                    <h1 className="text-3xl font font-semibold text-center my-7">
                        Welcome to my MERN Stack Blog!
                    </h1>
                    <p className="text-md text-gray-500">
                        This blog is a personal project built using the MERN
                        stack, which stands for MongoDB, Express.js, React, and
                        Node.js. It serves as a platform to share my thoughts,
                        experiences, and insights on various topics related to
                        web development, programming, and technology.
                    </p>
                </div>

                <div>
                    <h1 className="text-2xl font font-semibold text-center mt-7 mb-3">
                        Why MERN Stack?
                    </h1>
                    <p className="text-md text-gray-500 mb-4 text-center">
                        The MERN stack is a powerful and versatile set of
                        technologies for building modern web applications.
                        Here's a brief overview of each component
                    </p>

                    <div className="text-md text-gray-500 px-10 flex flex-col gap-2">
                        <li>
                            <b>MongoDB</b>: A NoSQL database that allows for
                            flexible and scalable data storage.
                        </li>
                        <li>
                            <b>Express.js</b>: A lightweight and robust web
                            application framework for Node.js, used to build the
                            backend server.
                        </li>
                        <li>
                            <b>React</b>: A popular JavaScript library for
                            building dynamic and interactive user interfaces.
                        </li>
                        <li>
                            <b>Node.js</b>: A runtime environment that allows
                            for server-side execution of JavaScript.
                        </li>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font font-semibold text-center mt-7 mb-3">
                        Features of This Blog
                    </h1>

                    <div className="text-md text-gray-500 px-10 flex flex-col gap-2">
                        <li>
                            <b>Dynamic Content</b>: Easily create, read, update,
                            and delete blog posts.
                        </li>
                        <li>
                            <b>User Authentication</b>: Secure login and
                            registration system to protect user data.
                        </li>
                        <li>
                            <b>Responsive Design</b>: Optimized for both desktop
                            and mobile devices.
                        </li>
                        <li>
                            <b>Commenting System</b>: Engage with readers
                            through comments and discussions.
                        </li>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
