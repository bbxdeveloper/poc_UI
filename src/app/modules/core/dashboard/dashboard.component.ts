import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isReady: boolean = false;
  products: TreeGridNode<InvoiceProduct>[] = [];

  productGratestValue: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Value - a.data.Value;
  productGratestPrice: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Price - a.data.Price;
  productGratestAmount: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Amount - a.data.Amount;
  productSmallestValue: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Value - b.data.Value;
  productSmallestPrice: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Price - b.data.Price;
  productSmallestAmount: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Amount - b.data.Amount;

  constructor(private seInv: InvoiceService) { }

  ngOnInit(): void {
    this.seInv.getMockData("").subscribe(data => {
      this.products = data.Products.map((x: InvoiceProduct) => { return { data: x }; })
    })
    this.isReady = true;
  }

}
