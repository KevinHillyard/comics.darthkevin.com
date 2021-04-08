Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
  el: '#app',
  data: {
    number: '',
    max: '',
    current: {
      title: '',
      img: '',
      alt: ''
    },
    loading: true,
    addedName: '',
    addedComment: '',
    commentMonth: '',
    commentDay: '',
    commentYear: '',
    commentTime: '',
    comments: {},
    ratingAverage: '',
    ratings: {},
  },
  created() {
    this.xkcd();
  },
  computed: {
    month() {
      var month = new Array;
      if (this.current.month === undefined)
        return '';
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month[this.current.month - 1];
    },
    getAverageRating() {
      if (!(this.number in this.ratings))
        return 0;
      this.ratingAverage = this.ratings[this.number].average;
      return this.ratingAverage;
    }
  },
  methods: {
    xkcd() {
      this.loading = true;
      let url = 'https://xkcd.now.sh/?comic=';
      if (this.number === '') {
        url += 'latest';
      } else {
        url += this.number;
      }
      axios.get(url)
        .then(response => {
          this.current = response.data;
          this.number = response.data.num;
          return true;
        })
        .catch(error => {
          console.log(error)
          this.number = this.max;
        })
        .finally(func => {
          this.loading = false;
        });
    },
    previousComic() {
      this.number = this.current.num - 1;
      if (this.number < 1)
        this.number = 1;
    },
    nextComic() {
      this.number = this.current.num + 1;
      if (this.number > this.max)
        this.number = this.max
    },
    firstComic() {
      this.number = 1;
    },
    lastComic() {
      this.number = this.max;
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomComic() {
      this.number = this.getRandom(1, this.max);
    },
    addComment() {
      if (!(this.number in this.comments))
        Vue.set(app.comments, this.number, new Array);
      var d = new Date();
      this.commentMonth = this.getMonth(d.getMonth());
      this.commentDay = d.getDate();
      this.commentYear = d.getFullYear();
      this.commentTime = d.getHours() + ":" + d.getMinutes();
      this.comments[this.number].push({
        author: this.addedName,
        text: this.addedComment,
        month: this.commentMonth,
        day: this.commentDay,
        year: this.commentYear,
        time: this.commentTime
      });
      this.addedName = '';
      this.addedComment = '';
      this.commentMonth = '';
      this.commentDay = '';
      this.commentYear = '';
      this.commentTime = '';
    },
    setRating(rating){
      if (!(this.number in this.ratings))
        Vue.set(this.ratings, this.number, {
          sum: 0,
          total: 0,
          average: 0
        });
      this.ratings[this.number].sum += rating;
      this.ratings[this.number].total += 1;
      var ave = this.ratings[this.number].sum / this.ratings[this.number].total;
      this.ratings[this.number].average = Math.round(ave * 10) / 10;
      this.ratingAverage = this.ratings[this.number].average;
    },
    getMonth(number) {
      switch (number) {
        case 0:
          return "January";

        case 1:
          return "February";

        case 2:
          return "March";

        case 3:
          return "April";

        case 4:
          return "May";

        case 5:
          return "June";

        case 6:
          return "July";

        case 7:
          return "August";

        case 8:
          return "September";

        case 9:
          return "October";

        case 10:
          return "November";

        default:
          return "December";
      }
    }
  },
  watch: {
    number(value, oldvalue) {
      if (oldvalue === '') {
        this.max = value;
      } else {
        this.xkcd();
      }
    },
    //ratingAverage() {
    //  return this.getAverage();
    //}
  },
});
