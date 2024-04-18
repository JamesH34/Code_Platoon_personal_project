function AboutPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centers the content horizontally
            marginTop: '50px' // Adds space on the top of the container
        }}>
            <div style={{
                backgroundColor: '#f0f0f0', // Light grey background
                padding: '20px',
                borderRadius: '15px', // Rounded corners
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                maxWidth: '600px', // Limits maximum width of the container
                width: '90%', // Responsive width
                textAlign: 'center' // Centers the text
            }}>
                <h1>Welcome To Easy Rider</h1>
                <h2>1 S Dearborn St, Chicago, IL 60603</h2>
                <p>Embark on the ride of a lifetime with America's premier motorcycle rental service, where the spirit of adventure awaits. Explore iconic routes and hidden gems on our top-of-the-line bikes, meticulously maintained for your safety and riding pleasure. Book your next great escape today and feel the exhilarating freedom of cruising across America’s scenic highways.</p>
            </div>
        </div>
    )
}

export default AboutPage;