self.addEventListener('message', function (e) {
    if (e.data == "Start") {
        Start();
    }
}, false);

var LawnMower = function () {
    this.lawn = new Array(4);

    for (var x = 0; x < 4; x++) {
        this.lawn[x] = new Array(4); //Convert Lawn into 2 dimensional array
        for (var y = 0; y < 4; y++) {
            this.lawn[x][y] = "Uncut";
        }
    }

    this.score = 1;
    this.DNA = "";
    this.CurrentXPosition = 0;
    this.CurrentYPosition = 0,
    this.TurnLeft = function () {
        switch (this.Direction) {
            case "South":
                this.Direction = "East";
                break;
            case "North":
                this.Direction = "West";
                break;
            case "East":
                this.Direction = "North";
                break;
            case "West":
                this.Direction = "South";
                break;
            default:
                alert("Invalid Direction found in TurnLeft");
        }
    };

    this.TurnRight = function () {
        switch (this.Direction) {
            case "South":
                this.Direction = "West";
                break;
            case "North":
                this.Direction = "East";
                break;
            case "East":
                this.Direction = "South";
                break;
            case "West":
                this.Direction = "North";
                break;
            default:
                alert("Invalid Direction found in TurnRight");
        }
    };

    this.Direction = "South";
    this.MowForward = function () {
        switch (this.Direction) {
            case "South":
                if (this.CurrentYPosition < 3) {
                    this.CurrentYPosition++;
                    this.lawn[this.CurrentXPosition][this.CurrentYPosition] = "Cut";
                }
                break;
            case "North":
                if (this.CurrentYPosition != 0) {
                    this.CurrentYPosition--;
                    this.lawn[this.CurrentXPosition][this.CurrentYPosition] = "Cut";
                }
                break;
            case "East":
                if (this.CurrentXPosition < 3) {
                    this.CurrentXPosition++;
                    this.lawn[this.CurrentXPosition][this.CurrentYPosition] = "Cut";
                }
                break;
            case "West":
                if (this.CurrentXPosition != 0) {
                    this.CurrentXPosition--;
                    this.lawn[this.CurrentXPosition][this.CurrentYPosition] = "Cut";
                }
                break;
            default:
                alert("Invalid Direction found in MowForward");
        }
    };

    this.MowLawn = function () {
        // DNA is a string of instructions (M,L,R).
        for (var x = 0; x < this.DNA.length; x++) {
            var instruction = this.DNA.substring(x, x + 1);
            switch (instruction) {
                case "M":
                    this.MowForward();
                    break;
                case "L":
                    this.TurnLeft();
                    break;
                case "R":
                    this.TurnRight();
                    break;
                default:
                    alert("Invalid DNA");
            }
        }

    };

    this.EvaluateLawn = function () {
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                if (this.lawn[x][y] == "Cut") {
                    this.score++;
                }
            }
        }
    }

    this.UncutGrass = function () {
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                this.lawn[x][y] = "Uncut";
            }
        }
    }

    this.Reset = function () {
        this.score = 1;
        this.Direction = "South";
        this.UncutGrass();
        this.CurrentXPosition = 0;
        this.CurrentYPosition = 0;
    }
}

var Generation = function () {
    this.bestSaved = 0;
    this.size = 100;
    this.winner = "";
    this.mowers = new Array(this.size);
    this.populateGeneration = function () {
        for (var x = 0; x < this.size; x++) {
            this.mowers[x] = new LawnMower();
            this.mowers[x].DNA = this.GenerateDNA();
        }
    }
    this.GenerateDNA = function () {
        var returnValue = "";
        var length = Math.floor(Math.random() * 20) + 1;
        for (var x = 0; x < length; x++) {
            var allele = Math.floor(Math.random() * 4);
            switch (allele) {
                case 0:
                    allele = "M";
                    break;
                case 1:
                    allele = "M";
                    break;
                case 2:
                    allele = "R";
                    break;
                case 3:
                    allele = "L";
                    break;
                default:
                    alert("Invalid allele " + allele);
            }
            returnValue = returnValue + allele;
        }
        return returnValue;
    }

    this.mowAllLawns = function () {
        for (var x = 0; x < this.size; x++) {
            this.mowers[x].MowLawn();
            this.mowers[x].EvaluateLawn();
        }
    }

    this.Mate = function (nextGeneration) {
        var max = this.GetMaxScore();
        var roulette = new Array();
        var slots = 0;
        var nextGenMowerId = 0;
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.mowers[x].score * this.mowers[x].score; y++) {
                roulette[slots] = this.mowers[x];
                slots++;
            }
        }

        for (var x = 0; x < this.size / 2; x++) {
            var slot1 = Math.floor(Math.random() * slots);
            var slot2 = Math.floor(Math.random() * slots);
            var father = roulette[slot1];
            var mother = roulette[slot2];
            if (father.score == max && this.bestSaved == 0) {
                this.bestSaved = 1;
                nextGeneration.mowers[nextGenMowerId].DNA = father.DNA;
                nextGenMowerId++;
                return;
            }
            if (mother.score == max && this.bestSaved == 0) {
                this.bestSaved = 1;
                nextGeneration.mowers[nextGenMowerId].DNA = mother.DNA;
                nextGenMowerId++;
                return;
            }
            var lengthOfFathersDNA = father.DNA.length;
            var lengthOfMothersDNA = mother.DNA.length;
            var fathersSplicePoint1 = Math.floor(Math.random() * lengthOfFathersDNA);
            var mothersSplicePoint1 = Math.floor(Math.random() * lengthOfMothersDNA);
            var fathersSplicePoint2 = Math.floor(Math.random() * lengthOfFathersDNA);
            var mothersSplicePoint2 = Math.floor(Math.random() * lengthOfMothersDNA);
            var fathersSplicePointLeft;
            var fathersSplicePointRight;
            var mothersSplicePointLeft;
            var mothersSplicePointRight;

            if (fathersSplicePoint1 < fathersSplicePoint2) {
                fathersSplicePointLeft = fathersSplicePoint1;
                fathersSplicePointRight = fathersSplicePoint2;
            }
            else {
                fathersSplicePointLeft = fathersSplicePoint2;
                fathersSplicePointRight = fathersSplicePoint1;
            }

            if (mothersSplicePoint1 < mothersSplicePoint2) {
                mothersSplicePointLeft = mothersSplicePoint1;
                mothersSplicePointRight = mothersSplicePoint2;
            }
            else {
                mothersSplicePointLeft = mothersSplicePoint2;
                mothersSplicePointRight = mothersSplicePoint1;
            }

            var fathersLeft = father.DNA.substring(0, fathersSplicePointLeft);
            var fatheresMiddle = father.DNA.substring(fathersSplicePointLeft, fathersSplicePointRight);
            var fathersRight = father.DNA.substring(fathersSplicePointRight, lengthOfFathersDNA);
            var mothersLeft = mother.DNA.substring(0, mothersSplicePointLeft);
            var mothersMiddle = mother.DNA.substring(mothersSplicePointLeft, mothersSplicePointRight);
            var mothersRight = mother.DNA.substring(mothersSplicePointRight, lengthOfMothersDNA);

            nextGeneration.mowers[nextGenMowerId].DNA = fathersLeft + mothersMiddle + fathersRight;
            nextGenMowerId++;
            nextGeneration.mowers[nextGenMowerId].DNA = mothersLeft + fathersRight + mothersRight;
            nextGenMowerId++;
        }
    }

    this.GetMaxScore = function () {
        var max = 0;
        for (var x = 0; x < this.size; x++) {
            if (this.mowers[x].score > max) {
                max = this.mowers[x].score;
                this.winner = this.mowers[x];
            }
        }
        return max;
    }

    this.GetAverageScore = function () {
        var total = 0;
        for (var x = 0; x < this.size; x++) {
            total = total + this.mowers[x].score;
        }
        return total / this.size;
    }
}

function Start() {
    var generation = new Generation();
    generation.populateGeneration();
    var success = 0;

    for (var y = 0; y < 10000; y++) {
        generation.mowAllLawns();
        if (generation.GetMaxScore() > 15) {
            //alert("Best:" + generation.GetMaxScore() + " Average:" + generation.GetAverageScore() + " Length:" + generation.winner.DNA.length + " " + generation.winner.DNA + " in " + y + " generations");
            success = 1;
            self.postMessage(generation.winner.DNA);
            self.postMessage("Complete");
            break;
        }

        if (y % 100) {
            self.postMessage(generation.winner.DNA);
        }
        var nextGeneration = new Generation();
        nextGeneration.populateGeneration();
        generation.Mate(nextGeneration);
        generation = nextGeneration;
    }
    if (success == 0) {
        //alert("Solution not found");
    }
}