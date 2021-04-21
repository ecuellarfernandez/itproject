import React, {useState, useEffect, useRef} from "react";
import "./App.css";
const imgPerPage = 10;

function App() {
	const [allImages, setAllImages] = useState(null);
	const [images, setImages] = useState([]);
	const [imgCount, setImgCount] = useState(0);

	const fetchData = async () => {
		try {
			const response = await fetch("https://jsonplaceholder.typicode.com/photos");
			const data = await response.json();
			setAllImages(data);
		} catch (error) {
			console.error("error", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const moreImages = () => {
		if (allImages) {
			const newImages = allImages.slice(imgCount, imgCount + imgPerPage);
			setImgCount((prev) => prev + newImages.length);
			setImages((prev) => [...prev, ...newImages]);
		}
	};

	const containerToIntersect = useRef(null);

	const observerCallback = (entries) => {
		const firstEntry = entries[0];
		if (firstEntry.isIntersecting) moreImages();
	};

	const observerOptions = {threshold: 1};

	useEffect(() => {
		const observer = new IntersectionObserver(observerCallback, observerOptions);

		const currentElement = containerToIntersect.current;

		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			if (currentElement) {
				observer.unobserve(currentElement);
			}
		};
		// eslint-disable-next-line
	}, [containerToIntersect, observerOptions]);

	const onClickRemove = (id) => {
		const newImages = images.filter((item) => item.id !== id);
		setImages(newImages);
	};

	return (
		<ul className="gallery">
			{images.map((i) => {
				return (
					<li key={i.id} onClick={() => onClickRemove(i.id)}>
						<img alt={i.title} src={i.url} width="200" height="200" />
					</li>
				);
			})}

			<li ref={containerToIntersect}></li>
		</ul>
	);
}

export default App;
