import React, {useState, useEffect, useRef} from "react";
import "./App.css";

function App() {
	const [allImages, setAllImages] = useState([]);
	const [imgCount, setImgCount] = useState(1);

	const fetchData = async () => {
		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/photos?_page=${imgCount}&_limit=10`
			);
			const data = await response.json();
			setImgCount((prev) => prev + 1);
			setAllImages((prev) => [...prev, ...data]);
		} catch (error) {
			console.error("error", error);
		}
	};

	const containerToIntersect = useRef(null);

	const observerCallback = (entries) => {
		const firstEntry = entries[0];
		if (firstEntry.isIntersecting) fetchData();
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
		const newImages = allImages.filter((item) => item.id !== id);
		setAllImages(newImages);
	};

	return (
		<ul className="gallery">
			{allImages.map((i) => {
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
