import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Get in Touch</h1>
      <div className="max-w-3xl mx-auto text-lg leading-relaxed text-center mb-8">
        <p className="mb-4">
          I'm always excited to connect with new people and discuss potential collaborations, job opportunities, or just chat about tech!
          Feel free to send me a message using the form below, or connect with me on social media.
        </p>
      </div>
      <form className="mt-8 w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
            Message:
          </label>
          <textarea
            id="message"
            rows={5}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Message"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Send Message
        </button>
      </form>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect with me:</h2>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-lg">LinkedIn</a>
          <a href="#" className="text-gray-800 hover:text-gray-600 text-lg">GitHub</a>
          <a href="#" className="text-blue-400 hover:text-blue-600 text-lg">Twitter</a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;